import { serverLoginService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request for user login.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - The response object.
 */
export const POST = async (request: Request): Promise<Response> => {
    try {
        // Parse the request body to extract the password
        const password = await parseBody<{ password: string }>(request);

        // Perform the login operation
        const loginResponse = await serverLoginService.login(password);

        // Return the login response as JSON
        return Response.json(loginResponse);
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};