import { AxiosError } from "axios";
import { APIBadRequestError, APIError } from "../errors/api.error";
import { NextRequest } from "next/server";
import { Logger } from "../services/logger.service";
import { APIResponseStatuses } from "../enums/api-response-statuses.enum";

/**
 * Parse the body of a request as JSON.
 * @throws APIBadRequestError if the body is empty or not valid JSON, Error if an internal error occurs
 * @param req The request to parse the body from
 * @returns The parsed body
 */
export async function parseBody<T = unknown>(req: Request): Promise<T> {
    // Throw a 400 error if the body is empty
    if (req.body === null) {
        throw new APIBadRequestError('Request body is empty');
    }

    try {
        const chunks = [];
        // The body is a readable binary stream
        const reader = req.body.getReader();

        // Read the body into chunks
        let readResult;
        while (!(readResult = await reader.read()).done) { // While there is still data to read
            const value = readResult.value;
            if (value !== undefined) { 
                chunks.push(value);
            }
        }

        // Concatenate the chunks into a single string buffer
        const data = Buffer.concat(chunks).toString();
        // Parse the body as JSON
        return JSON.parse(data) as T;
    } catch (error) {
        if(error instanceof SyntaxError) throw new APIBadRequestError('Request body is not valid JSON'); // Throw a 400 error if the body is not valid JSON
        else throw error; // Rethrow, the error will be handled upstream by handleAPIError as an unknown internal error
    }
}

/**
 * Build a response object with the given body and status code.
 * @param error 
 * @returns an appropriate Response
 */
export const handleAPIError = (error: Error): Response => {
    Logger.error(error);

    // If the error was not properly handled, it will not be an APIError
    // Return a generic 500 error response
    if(!(error instanceof APIError)) {
        Logger.debug('Error was not an APIError, returning generic 500 error response');
        return new Response(JSON.stringify({
            success: false,
            error: { status: 500, message: 'Unhandeled internal error: ' + error.message }
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    Logger.debug('Error was an APIError, returning an appropriate error response with status code ' + error.status);

    // The error was properly handled, return an appropriate error response
    const apiError = error;
    return new Response(JSON.stringify({
        success: false,
        error: { status: apiError.status, message: error.message }
    }), {
        status: apiError.status,
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Handle an Axios error and throw an appropriate APIError.
 * @param err the error to handle
 * @throws APIError
 */
export const handleAxiosError = (err: AxiosError): void => {
    Logger.error(err);
    throw new APIError(err.response?.statusText ?? 'Unknown Error', APIResponseStatuses.INTERNAL_SERVER_ERROR ?? 500);
}

/**
 * Get the value of a URL parameter.
 * @throws APIBadRequestError if the parameter is missing
 * @param req the request containing the URL with the parameter
 * @param paramName the name of the parameter
 * @returns the value of the parameter
 */
export const getUrlParam = (req: NextRequest, paramName: string): string => {
    const param = req.nextUrl.searchParams.get(paramName);
    if(param === null) throw new APIBadRequestError(`${paramName} is required`);
    return param;
}