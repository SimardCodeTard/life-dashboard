import { ChatMessage } from "@/app/types/chat.type";
import { DateTime } from "luxon";
import OpenAI from "openai";
import { Logger } from "../logger.service";
import { APIInternalServerError } from "@/app/errors/api.error";

export namespace serverOpenAIService {

    const blockAPICalls = process.env?.BLOCK_OPEN_AI_API_CALLS === 'true' ?? false; // Will be removed in the future

    let messages: Array<ChatMessage> = buildStartingMessages();

    const apiKey = process.env.OPENAI_API_KEY;

    const openai = apiKey ? new OpenAI({
        apiKey: apiKey,
    }) : null;

    const model = process.env.OPENAI_GPT_MODEL as string;

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
        if(!openai) throw new APIInternalServerError('Invalid server configuration: OpenAI API key is missing.');

        if (message) {
            messages.push(message);
        }
    
        if (blockAPICalls) {
            return [{ role: 'assistant', content: 'OpenAI API calls are currently blocked.' }];
        }
    
        if (messages.length === 0) {
            throw new APIInternalServerError('Attempted to call OpenAI with an empty messages array.');;
        }
    
        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: messages,
                model: model,
            });
    
            messages.push(chatCompletion.choices[0].message as ChatMessage);
    
            return messages;
        } catch (err: any) {
            throw new APIInternalServerError('OpenAI API error: ' + err.message);
        }
    };
    
    
}