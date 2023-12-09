import { APIError } from "openai/error.mjs";
import { APIBadRequestError } from "../errors/api.error";

export async function parseBody<T = unknown>(req: Request): Promise<T> {
    if (req.body === null) {
        throw new APIBadRequestError('Request body is empty');
    }

    try {
        const chunks = [];
        const reader = req.body.getReader();

        let readResult;
        while (!(readResult = await reader.read()).done) {
            const value = readResult.value;
            if (value !== undefined) {
                chunks.push(value);
            }
        }

        const data = Buffer.concat(chunks).toString();
        return JSON.parse(data) as T;
    } catch (error) {
        throw new APIBadRequestError('Request body is not valid JSON');
    }
}

/**
 * Build a response object with the given body and status code.
 * @param error 
 * @returns an appropriate Response
 */
export const handleAPIError = (error: Error): Response => {
    if(!(error as any).status) return new Response(JSON.stringify({
        success: false,
        error: {
            status: 500,
            message: 'Unknown error: ' + error.message
        }
    }), {
        status: 500,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const apiError = error as APIError;

    return new Response(JSON.stringify({
        success: false,
        error: {
            status: apiError.status,
            message: error.message
        }
    }), {
        status: apiError.status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}