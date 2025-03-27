import assert from "assert";
import { ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { Logger } from "../logger.service";
import { axiosClientService } from "./axios.client.service";
import { ChatMessageType } from "@/app/types/chat.type";
import { ChatNewResponseType, ChatRequestBodyType, ChatResponseType } from "@/app/types/api.type";

export namespace clientOpenAIService {
    // Ensure the API URL is defined
    try {
        assert(process.env.NEXT_PUBLIC_API_URL !== undefined);
    } catch (e) {
        Logger.error(e as Error);
    }

    // Base URL for the OpenAI chat service
    const url = `${process.env.NEXT_PUBLIC_API_URL}/chat`;

    /**
     * Starts a new conversation with the OpenAI chat service.
     * @returns {Promise<ChatMessageType[]>} A promise that resolves to an array of chat messages.
     */
    export const startNewConversation = (): Promise<ChatMessageType[]> => {
        return axiosClientService.GET<ChatNewResponseType>(`${url}/new`).then(res => res.data);
    };

    /**
     * Sends a message to the OpenAI chat service.
     * @param {ChatCompletionUserMessageParam} message - The message to send.
     * @returns {Promise<ChatMessageType[]>} A promise that resolves to an array of chat messages.
     */
    export const sendMessage = (message: ChatRequestBodyType): Promise<ChatMessageType[]> => {
        return axiosClientService.POST<ChatResponseType>(url, message).then(res => res.data);
    };
}
