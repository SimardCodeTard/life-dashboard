import { ChatMessage } from "@/app/types/chat.type";
import { DateTime } from "luxon";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
import { Logger } from "../logger.service";
import { APIInternalServerError } from "@/app/errors/api.error";

export namespace OpenAIServerService {

    const blockAPICalls = false;

    let messages: Array<ChatMessage> = buildStartingMessages();

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const model = process.env.NEXT_PUBLIC_OPENAI_GPT_MODEL as string;

    function buildStartingMessages(): Array<ChatMessage> {
        const startingMessages: Array<ChatMessage> = [
            {role: 'system', content: 'Your name is Luna. You are a sentient helpful assistant. The year is ' + DateTime.now().year + '.'},
        ];

        return startingMessages; 
    }

    export const startNewConversation = async () => {
        messages.length = 0;
        messages = buildStartingMessages();
        return await nextMessage();
    }

    export const nextMessage = async (message?: ChatMessage) => {
        if (message) {
            messages.push(message);
        }
    
        if (blockAPICalls) {
            return [{ role: 'assistant', content: 'API calls are currently blocked.' }];
        }
    
        if (messages.length === 0) {
            const internalError = new APIInternalServerError('Attempted to call OpenAI with an empty messages array.');
            Logger.error(internalError);
            throw internalError;
        }
    
        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: messages,
                model: model,
            });
    
            messages.push(chatCompletion.choices[0].message as ChatMessage);
    
            return messages;
        } catch (err: any) {
            Logger.error(err);
            throw new APIInternalServerError('OpenAI API error: ' + err.message);
        }
    };
    
    
}