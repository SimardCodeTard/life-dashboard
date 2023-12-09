import assert from "assert";
import axios from "axios";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";

export namespace OpenAIClientService {
    assert(process.env.NEXT_PUBLIC_API_URL !== undefined);
    const url = process.env.NEXT_PUBLIC_API_URL + "/chat" as string;

    export function startNewConversation() {
        return axios.get(url + '/new').then(res => res.data);
    
    }

    export function sendMessage(message: ChatCompletionUserMessageParam) {
        return axios.post(url, {role: 'user', content: message}).then(res => res.data);
    }
}