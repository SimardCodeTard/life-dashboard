import { OpenAIServerService } from "@/app/services/server/openai-server.service";
import { ChatMessage } from "@/app/types/chat.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const  message = await parseBody<ChatMessage>(req)
        const res = await OpenAIServerService.nextMessage(message);
        return Response.json(res);
    } catch (err) {
        return handleAPIError(err as Error);
    }
}