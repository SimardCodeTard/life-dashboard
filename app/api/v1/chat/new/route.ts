import { serverOpenAIService } from "@/app/services/server/openai-server.service";
import { ChatNewResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";

/**
 * Handles the GET request to start a new conversation using the OpenAI service.
 * 
 * @param _req - The incoming request object (not used in this handler).
 * @returns A promise that resolves to a Response object containing the new conversation data.
 */

const getHandler = (): Promise<ChatNewResponseType> => serverOpenAIService.startNewConversation();

export const GET = async (_: Request): Promise<Response> => {
    try {
        return Response.json(await getHandler());
    } catch (err) {
        return handleAPIError(err);
    }
}