import { Logger } from "@/app/services/logger.service";
import { OpenAIServerService } from "@/app/services/server/openai-server.service";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (Req: NextRequest) => {
    return Response.json(await OpenAIServerService.startNewConversation()
    .catch(handleAPIError))
};