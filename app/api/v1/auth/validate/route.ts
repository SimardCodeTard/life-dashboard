import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthValidateResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { setAuthRefreshTokenCookie, setAuthTokenCookie } from "@/app/utils/cookies.utils";
import { NextRequest } from "next/server";

/**
 * Handles the POST request to validate a token or refresh token.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - The response object.
 */

const getHandler = async (req: NextRequest): Promise<AuthValidateResponseType> => {
    const token = req.cookies.get(CookieNamesEnum.AUTH_TOKEN)?.value as string;
    const refreshToken = req.cookies.get(CookieNamesEnum.REFRESH_TOKEN)?.value;
    const clientIp = req.headers.get('x-forwarded-for') as string;

    // Validate the token or refresh token using the server login service
    const {user, token: newToken, refreshToken: newRefreshToken} = await serverLoginService.validateTokenOrRefreshToken(token, clientIp, refreshToken);

    if(newToken) {
        setAuthTokenCookie(newToken);
    }

    if (newRefreshToken) {
        setAuthRefreshTokenCookie(newRefreshToken);
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