import { serverOpenAIService } from "@/app/services/server/openai-server.service";
import { ChatResponseType } from "@/app/types/api.type";
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

const postHandler = async (req: Request): Promise<ChatResponseType> => {
    const chatMessage: ChatMessageType = await parseBody<ChatMessageType>(req);

    return serverOpenAIService.nextMessage(chatMessage);
}

export const POST = async (req: Request): Promise<Response> => {
    try {
        return Response.json(await postHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
}