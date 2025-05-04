import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { Logger } from "@/app/services/logger.service";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthValidateResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { getCookie, getInactiveUserAuthRefreshTokenName, getInactiveUserAuthTokenName, setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { debug } from "console";
import { NextRequest } from "next/server";

/**
 * Handles the POST request to validate a token or refresh token.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - The response object.
 */

const getHandler = async (req: NextRequest): Promise<AuthValidateResponseType> => {
    const userId = req.nextUrl.searchParams.get('userId');
    Logger.debug(`Got get param userId=${userId}`)
    const token = userId ? (await getCookie(getInactiveUserAuthTokenName(userId)))?.value as string : (await getCookie(CookieNamesEnum.AUTH_TOKEN))?.value as string;
    Logger.debug(`token=${token}`)
    const refreshToken = userId ? (await getCookie(getInactiveUserAuthRefreshTokenName(userId)))?.value : (await getCookie(CookieNamesEnum.REFRESH_TOKEN))?.value;
    Logger.debug(`refresh token=${refreshToken}`)
    const clientIp = req.headers.get('x-forwarded-for') as string;

    // Validate the token or refresh token using the server login service
    const {user, token: newToken, refreshToken: newRefreshToken} = await serverLoginService.validateTokenOrRefreshToken(token, clientIp, refreshToken);

    if(newToken) {
        setAuthTokenCookie(newToken, userId ? getInactiveUserAuthTokenName(userId) : undefined);
    }

    if (newRefreshToken) {
        setAuthRefreshTokenCookie(newRefreshToken, userId ? getInactiveUserAuthRefreshTokenName(userId) : undefined);
    }

    return {user};
}

export const GET = async (req: NextRequest): Promise<Response> => {
    try {
        return Response.json(await getHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
} 