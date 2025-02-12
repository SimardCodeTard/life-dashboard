import { serverLoginService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request for user login validation.
 * 
 * @param request - The incoming request object
 * @returns A promise that resolves to a JSON response indicating the login status
 */
export const POST = async (request: Request): Promise<Response> => {
    try {
        // Parse the request body to extract the password
        const body = await parseBody<{ password: string }>(request);
        
        // Check if the user is logged in using the provided password
        const isValid = await serverLoginService.isLoggedIn(body.password);
        
        // Return the login status as a JSON response
        return Response.json({ valid: isValid });
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};