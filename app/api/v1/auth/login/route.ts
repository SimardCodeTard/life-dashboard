import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { APIBadRequestError } from "@/app/errors/api.error";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthLoginRequestBodyType, AuthLoginResponseType } from "@/app/types/api.type";
import { UserTypeClient } from "@/app/types/user.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { cookies } from "next/headers";

/**
 * Post handler to login
 * @param req - The request containing a body with the email address a,d the password of the user and keepLoggedIn, a boolean, true if the api should also send a refresh token
 * @returns {@type AuthLoginResponseType} - A response containing a JWT Token, a JWT Refresh Token if the user chose to stay logged in and the user object without the password
 */

const postHandler = async (req: Request): Promise<{token: string, refreshToken?: string, user: UserTypeClient}> => {
    const body = await parseBody<AuthLoginRequestBodyType>(req);
    const clientIp = req.headers.get('x-forwarded-for') as string;

    if(!body.mail || !body.password || typeof body.keepLoggedIn !== 'boolean') {
        throw new APIBadRequestError('Invalid login body');
    }

    return await serverLoginService.login(body.mail, body.password, body.keepLoggedIn, clientIp);
}

export const POST = async (req: Request): Promise<Response> => {
    try {
        const { user, token, refreshToken } = await postHandler(req);

        // Set the authentication token in an HttpOnly, Secure cookie
        (await cookies()).set(CookieNamesEnum.AUTH_TOKEN, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        if (refreshToken) {
            (await cookies()).set(CookieNamesEnum.REFRESH_TOKEN, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Secure in production
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 1 month
            });
        }

        // Return only user data, no tokens
        return Response.json({ user });
    } catch (err) {
        return handleAPIError(err);
    }
};