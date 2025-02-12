import { serverLoginService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request to validate a token or refresh token.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - The response object.
 */
export const POST = async (request: Request): Promise<Response> => {
    try {
        // Parse the request body to extract token and refreshToken
        const { token, refreshToken } = await parseBody<{ token: string, refreshToken: string }>(request);
        
        // Validate the token or refresh token using the server login service
        const validationResult = await serverLoginService.validateTokenOrRefreshToken({ token, refreshToken });
        
        // Return the validation result as a JSON response
        return Response.json(validationResult);
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};