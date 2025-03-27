import { serverLoginService } from "@/app/services/server/login.server.service";
import { AuthLoginRequestBodyType, AuthLoginResponseType } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Post handler to login
 * @param req - The request containing a body with the email address a,d the password of the user and keepLoggedIn, a boolean, true if the api should also send a refresh token
 * @returns {@type AuthLoginResponseType} - A response containing a JWT Token, a JWT Refresh Token if the user chose to stay logged in and the user object without the password
 */

const postHandler = async (req: Request): Promise<AuthLoginResponseType> => {
    const body = await parseBody<AuthLoginRequestBodyType>(req);

    return await serverLoginService.login(body);
}

export const POST = async (req: Request): Promise<Response> => Response.json(await postHandler(req).catch(handleAPIError));