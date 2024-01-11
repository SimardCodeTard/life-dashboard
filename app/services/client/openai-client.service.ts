import assert from "assert";
import axios from "axios";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { Logger } from "../logger.service";

export namespace OpenAIClientService {
    try{
        assert(process.env.NEXT_PUBLIC_API_URL !== undefined);
    } catch (e) {
        Logger.error(e as Error);
    }
    const url = process.env.NEXT_PUBLIC_API_URL + "/chat" as string;

    export const startNewConversation = () => axios.get(url + '/new').then(res => res.data);

    export const sendMessage = (message: ChatCompletionUserMessageParam) => axios.post(url, {role: 'user', content: message}).then(res => res.data);
}