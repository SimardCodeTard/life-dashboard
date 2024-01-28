import { serverOpenAIService } from "@/app/services/server/openai-server.service";
import { ChatMessage } from "@/app/types/chat.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

export const POST = (req: NextRequest): Promise<Response> => parseBody<ChatMessage>(req).then(serverOpenAIService.nextMessage).then(Response.json).catch(handleAPIError);