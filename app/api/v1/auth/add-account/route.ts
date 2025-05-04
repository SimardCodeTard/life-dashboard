import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { APIBadRequestError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "@/app/services/logger.service";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { serverUserDataService } from "@/app/services/server/user-data.server.service";
import { AuthAddAccountRequestBodyType, AuthAddAccountResponseType, AuthLoginRequestBodyType } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils"
import { getInactiveUserAuthRefreshTokenName, getInactiveUserAuthTokenName, setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const postHandler = async (req: Request, previousActiveUserid: string): Promise<AuthAddAccountResponseType> => {
    // Parse the body
    const { isNewAccount, content } = await parseBody<AuthAddAccountRequestBodyType>(req);
    const clientIp = req.headers.get('x-forwarded-for') as string;
    const previousAuthToken = (await cookies()).get(CookieNamesEnum.AUTH_TOKEN)?.value;
    const previousRefreshToken = (await cookies()).get(CookieNamesEnum.REFRESH_TOKEN)?.value;

    if(!content) {
        throw new APIBadRequestError('Invalid register body.');
    }

    let newUserCredentials: {
        mail: string, 
        password: string
    } = {
        mail: (content as AuthLoginRequestBodyType).mail, 
        password: (content as AuthLoginRequestBodyType).password
    };

    if(isNewAccount) {
        const newUser = content.user;
        // save the new user to the DB
        const result = await serverUserDataService.saveUser({...newUser, mail: newUser.mail.toLowerCase()});

        newUserCredentials = newUser;

        Logger.debug(JSON.stringify(result));

        if(!result.insertedId) {
            throw new APIInternalServerError('Failed to register new user')
        }

    }

    const keepLoggedIn = content.keepLoggedIn;
    const { user, token, refreshToken } = await serverLoginService.login(newUserCredentials.mail.toLowerCase(), newUserCredentials.password, keepLoggedIn, clientIp);
    
    setAuthTokenCookie(token);

    if (refreshToken) {
        setAuthRefreshTokenCookie(token);
    }

    if(previousAuthToken && previousActiveUserid) {
        const previousAuthTokenCookieName = getInactiveUserAuthTokenName(previousActiveUserid);
        setAuthTokenCookie(previousAuthToken, previousAuthTokenCookieName);
    }

    if (previousRefreshToken && previousActiveUserid) {
        const previousAuthRefreshTokenCookieName = getInactiveUserAuthRefreshTokenName(previousActiveUserid);
        setAuthRefreshTokenCookie(previousRefreshToken, previousAuthRefreshTokenCookieName);
    }

    return { user };
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