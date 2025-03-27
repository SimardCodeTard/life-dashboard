import { APIBadRequestError, APIInternalServerError } from "@/app/errors/api.error";
import { serverLoginService } from "@/app/services/server/login.server.service";
import { serverUserDataService } from "@/app/services/server/user-data.server.service";
import { AuthRegisterRequestBodyType, AuthRegisterResponseType } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Post handler to register
 * @param req - The request containing a body with the register information
 * @returns {@type AuthRegisterResponseType} A response containing a boolean, true if he login was 
 */
const postHandler = async(req: Request): Promise<AuthRegisterResponseType> => {
    // Parse the body
    const { user, keepLoggedIn } = await parseBody<AuthRegisterRequestBodyType>(req);

    if(!user || typeof keepLoggedIn !== 'boolean') {
        throw new APIBadRequestError('Invalid register body.');
    }

    // save the new user to the DB
    const result = await serverUserDataService.saveUser({...user, mail: user.mail.toLowerCase()});

    if(result.insertedId) {
        return await serverLoginService.login({mail: user.mail.toLowerCase(), password: user.password, keepLoggedIn});
    } else {
        throw new APIInternalServerError('Failed to register new user');
    }
}

export const POST = async (req: Request): Promise<Response> => {
    try {
        return Response.json(await postHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
};