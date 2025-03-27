import { APINotFoundError } from "@/app/errors/api.error";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { serverUserDataService } from "@/app/services/server/user-data.server.service";
import { AuthValidateRequestBodyType, AuthValidateResponseType } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request to validate a token or refresh token.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - The response object.
 */

const postHandler = async (request: Request): Promise<AuthValidateResponseType> => {
    // Parse the request body to extract the email, token and refreshToken
    const { mail, token, refreshToken } = await parseBody<AuthValidateRequestBodyType>(request);
            
    // Fetch the user data from mail
    const user = await serverUserDataService.findUserByMail(mail);

    if(user === null) {
        throw new APINotFoundError('User not found');
    }

    // Validate the token or refresh token using the server login service
    const validationResult = await serverLoginService.validateTokenOrRefreshToken({ token, refreshToken, user });

    return {...validationResult, user};
}

export const POST = async (req: Request): Promise<Response> => Response.json(await postHandler(req).catch(handleAPIError));