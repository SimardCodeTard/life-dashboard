import assert from "assert";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { Logger } from "../logger.service";
import { axiosClientService } from "./axios.client.service";
import { ChatMessage } from "@/app/types/chat.type";

export namespace clientOpenAIService {
    try{
        assert(process.env.NEXT_PUBLIC_API_URL !== undefined);
    } catch (e) {
        Logger.error(e as Error);
    }
    const url = process.env.NEXT_PUBLIC_API_URL + "/chat" as string;

    export const startNewConversation = () => axiosClientService.GET<ChatMessage[]>(url + '/new').then(res => res.data);

    export const sendMessage = (message: ChatCompletionUserMessageParam): Promise<ChatMessage[]> => axiosClientService.POST<ChatMessage[]>(url, {role: 'user', content: message}).then(res => res.data);
}
