import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthValidateResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { cookies } from "next/headers";
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
    const {user, token: newToken, refreshToken: newRefreshToken} = await serverLoginService.validateTokenOrRefreshToken(token, clientIp, clientIp, refreshToken);

    if(newToken) {
        (await cookies()).set(CookieNamesEnum.AUTH_TOKEN, newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });
    }

    if (newRefreshToken) {
        (await cookies()).set(CookieNamesEnum.REFRESH_TOKEN, newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 1 month
        });
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