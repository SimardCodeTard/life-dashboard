import { serverOpenAIService } from "@/app/services/server/openai-server.service";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * Handles the GET request to start a new conversation using the OpenAI service.
 * 
 * @param _req - The incoming request object (not used in this handler).
 * @returns A promise that resolves to a Response object containing the new conversation data.
 */
export const GET = async (_req: NextRequest): Promise<Response> => {
    try {
        const conversation = await serverOpenAIService.startNewConversation();
        return new Response(JSON.stringify(conversation), { status: 200 });
    } catch (error) {
        return handleAPIError(error as Error);
    }
};