import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { APIBadRequestError, APIUnauthorizedError } from "@/app/errors/api.error";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthSwitchAccountResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { getCookie, getInactiveUserAuthRefreshTokenName, getInactiveUserAuthTokenName, setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { NextRequest } from "next/server";

const getHandler = async (request: NextRequest): Promise<AuthSwitchAccountResponseType> => {
    const newUserId = request.nextUrl.searchParams.get('userId');
    const previousUserId = request.nextUrl.searchParams.get('previousUserId');
    const clientIp = request.headers.get('x-forwarded-for') as string;

    if(!newUserId || ! previousUserId) {
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
        await serverLoginService.validateToken(newUserAuthToken);
        setAuthTokenCookie(newUserAuthToken);
    }

    if(newUserAuthRefreshToken) {
        await serverLoginService.validateRefreshToken(newUserAuthRefreshToken, clientIp)
        setAuthRefreshTokenCookie(newUserAuthRefreshToken);    
    }
    
    if(previousUserAuthToken) {
        setAuthTokenCookie(previousUserAuthToken, getInactiveUserAuthTokenName(previousUserId));
    }

    if(previousUserAuthRefreshToken) {
        setAuthTokenCookie(previousUserAuthRefreshToken, getInactiveUserAuthRefreshTokenName(previousUserId));
    }

    return {success: true};
}

export const GET = async (request: NextRequest) => {
    try {
        return Response.json(await getHandler(request));
    } catch (err) {
        handleAPIError(err);
    }
}