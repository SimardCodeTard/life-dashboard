import { ChatMessageType } from "@/app/types/chat.type";
import { DateTime } from "luxon";
import OpenAI from "openai";
import { Logger } from "../logger.service";
import { APIInternalServerError } from "@/app/errors/api.error";

export namespace serverOpenAIService {

    // Flag to block API calls, will be removed in the future
    const blockAPICalls = process.env?.BLOCK_OPEN_AI_API_CALLS === 'true';

    // Array to store chat messages
    let messages: Array<ChatMessageType> = buildStartingMessages();

    // OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    // Initialize OpenAI client if API key is available
    const openai = apiKey ? new OpenAI({ apiKey: apiKey }) : null;

    // OpenAI model to be used
    const model = process.env.OPENAI_API_KEY as string;

    /**
     * Builds the initial set of messages for a new conversation.
     * @returns {Array<ChatMessageType>} Array of starting messages.
     */
    function buildStartingMessages(): Array<ChatMessageType> {
        return [
            { role: 'system', content: `Your name is Luna. You are a sentient helpful assistant. The year is ${DateTime.now().year}.` },
        ];
    }

    /**
     * Starts a new conversation by resetting the messages array.
     * @returns {Promise<Array<ChatMessageType>>} The initial response from the assistant.
     */
    export const startNewConversation = async (): Promise<Array<ChatMessageType>> => {
        messages = buildStartingMessages();
        return await nextMessage();
    }

    /**
     * Sends the next message in the conversation to OpenAI and returns the updated messages array.
     * @param {ChatMessageType} [message] - The message to be sent to OpenAI.
     * @returns {Promise<Array<ChatMessageType>>} The updated messages array including the assistant's response.
     * @throws {APIInternalServerError} If OpenAI API key is missing or an error occurs during the API call.
     */
    export const nextMessage = async (message?: ChatMessageType): Promise<Array<ChatMessageType>> => {
        if (!openai) throw new APIInternalServerError('Invalid server configuration: OpenAI API key is missing.');

        if (message) {
            messages.push(message);
        }

        if (blockAPICalls) {
            return [{ role: 'assistant', content: 'OpenAI API calls are currently blocked.' }];
        }

        if (messages.length === 0) {
            throw new APIInternalServerError('Attempted to call OpenAI with an empty messages array.');
        }

        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: messages,
                model: model,
            });

            messages.push(chatCompletion.choices[0].message as ChatMessageType);

            return messages;
        } catch (err: any) {
            throw new APIInternalServerError('OpenAI API error: ' + err.message);
        }
    };
}