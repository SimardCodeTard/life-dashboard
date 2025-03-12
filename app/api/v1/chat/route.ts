import { serverOpenAIService } from "@/app/services/server/openai-server.service";
import { ChatMessageType } from "@/app/types/chat.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * Handles POST requests to the chat API endpoint.
 * 
 * @param req - The incoming request object.
 * @returns A promise that resolves to a Response object.
 */
export const POST = async (req: NextRequest): Promise<Response> => {
    try {
        // Parse the request body to get the chat message
        const chatMessage: ChatMessageType = await parseBody<ChatMessageType>(req);
        
        // Get the next message from the OpenAI service
        const responseMessage = await serverOpenAIService.nextMessage(chatMessage);
        
        // Return the response as JSON
        return Response.json(responseMessage);
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};