import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { APIBadRequestError, APIInternalServerError } from "@/app/errors/api.error";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { serverUserDataService } from "@/app/services/server/user-data.server.service";
import { AuthAddAccountRequestBodyType, AuthAddAccountResponseType } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils"
import { getInactiveUserAuthRefreshTokenName, getInactiveUserAuthTokenName, setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const postHandler = async (req: Request, previousActiveUserid: string): Promise<AuthAddAccountResponseType> => {
    // Parse the body
    const { user: newUser, keepLoggedIn } = await parseBody<AuthAddAccountRequestBodyType>(req);
    const clientIp = req.headers.get('x-forwarded-for') as string;
    const previousAuthToken = (await cookies()).get(CookieNamesEnum.AUTH_TOKEN)?.value;
    const previousRefreshToken = (await cookies()).get(CookieNamesEnum.REFRESH_TOKEN)?.value;

    if(!newUser || typeof keepLoggedIn !== 'boolean') {
        throw new APIBadRequestError('Invalid register body.');
    }
    // save the new user to the DB
    const result = await serverUserDataService.saveUser({...newUser, mail: newUser.mail.toLowerCase()});

    if(result.insertedId) {
        const { user, token, refreshToken } = await serverLoginService.login(newUser.mail.toLowerCase(), newUser.password, keepLoggedIn, clientIp);

        setAuthTokenCookie(token);

        if (refreshToken) {
            setAuthRefreshTokenCookie(token);
        }

        if(previousAuthToken && user._id) {
            const previousAuthTokenCookieName = getInactiveUserAuthTokenName(previousActiveUserid);
            setAuthTokenCookie(previousAuthToken, previousAuthTokenCookieName);
        }

        if (previousRefreshToken && user._id) {
            const previousAuthRefreshTokenCookieName = getInactiveUserAuthRefreshTokenName(previousActiveUserid);
            setAuthRefreshTokenCookie(previousRefreshToken, previousAuthRefreshTokenCookieName);
        }

        return { user };
    } else {
        throw new APIInternalServerError('Failed to register new user');
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const previousUserId = req.nextUrl.searchParams.get('previousActiveUserid');
        if(!previousUserId) {
            throw new APIBadRequestError('Missing required search params');
        }
        return Response.json(await postHandler(req, previousUserId));
    } catch (err) {
        return handleAPIError(err);
    }
}