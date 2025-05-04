import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { APIBadRequestError, APIUnauthorizedError } from "@/app/errors/api.error";
import { Logger } from "@/app/services/logger.service";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthSwitchAccountResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { getCookie, getInactiveUserAuthRefreshTokenName, getInactiveUserAuthTokenName, setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { NextRequest } from "next/server";

const getHandler = async (request: NextRequest): Promise<AuthSwitchAccountResponseType> => {
    const newUserId = request.nextUrl.searchParams.get('userId');
    const previousUserId = request.nextUrl.searchParams.get('previousUserId');
    const clientIp = request.headers.get('x-forwarded-for') as string;

    if(!newUserId || !previousUserId) {
        throw new APIBadRequestError('Missing or invalid required search params')
    }

    const newUserAuthToken = (await getCookie(getInactiveUserAuthTokenName(newUserId)))?.value;
    const newUserAuthRefreshToken = (await getCookie(getInactiveUserAuthRefreshTokenName(newUserId)))?.value;

    const previousUserAuthToken = (await getCookie(CookieNamesEnum.AUTH_TOKEN))?.value;
    const previousUserAuthRefreshToken = (await getCookie(CookieNamesEnum.REFRESH_TOKEN))?.value;

    if(!newUserAuthToken && !newUserAuthRefreshToken) {
        throw new APIBadRequestError('Missing auth tokens');
    }

    if(newUserAuthToken) {
        setAuthTokenCookie(newUserAuthToken);    
    } else if (!newUserAuthRefreshToken) {
        throw new APIBadRequestError('Missing auth and refresh tokens for new user');
    }

    if(newUserAuthRefreshToken) {
        setAuthRefreshTokenCookie(newUserAuthRefreshToken);    
    }

    const {token: newInactiveUserToken, refreshToken: newInactiveUserRefreshToken} = await serverLoginService.validateTokenOrRefreshToken(newUserAuthToken as string, clientIp, newUserAuthRefreshToken)
    
    if(previousUserAuthToken) {
        setAuthTokenCookie(newInactiveUserToken ?? previousUserAuthToken, getInactiveUserAuthTokenName(previousUserId));
    }

    if(previousUserAuthRefreshToken) {
        setAuthTokenCookie(newInactiveUserRefreshToken ?? previousUserAuthRefreshToken, getInactiveUserAuthRefreshTokenName(previousUserId));
    }

    return {success: true};
}

export const GET = async (request: NextRequest) => {
    try {
        return Response.json(await getHandler(request));
    } catch (err) {
        return handleAPIError(err);
    }
}