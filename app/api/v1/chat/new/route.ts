import { OpenAIServerService } from "@/app/services/server/openai-server.service";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const GET = (_req: NextRequest): Promise<Response> => OpenAIServerService.startNewConversation().then(Response.json).catch(handleAPIError);