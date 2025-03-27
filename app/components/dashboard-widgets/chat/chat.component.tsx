'use client'

import { FormEvent, useEffect, useRef, useState } from 'react';
import { clientOpenAIService } from '@/app/services/client/openai-client.service';
import { Logger } from '@/app/services/logger.service';
import ChatMessage from './chat-message/chat-message.component';
import { ChatMessageType } from '@/app/types/chat.type';
import Loader from '../../shared/loader/loader.component';


import './chat.scss';

export default function Chat({setIsLoading}: Readonly<{setIsLoading?: (isLoading: boolean) => boolean}>) {

    const [messages, setMessages] = useState<ChatMessageType[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        clientOpenAIService.startNewConversation().then(setMessages).then(() => setIsLoading?.(false)).catch(Logger.error)
    }, [])

    const sendMessage = (event: FormEvent) => {
        event.preventDefault();
        setIsLoading?.(true);

        const message = (event.target as any)[0].value;
        (event.target as any)[0].value = "";

        clientOpenAIService.sendMessage(message).then((messages: ChatMessageType[]) => {
            setMessages(messages);
        }).then(() => setIsLoading?.(false)).catch(Logger.error);
    }

    return (
        <div className='chat'>
            <div className='chat-messages'>
                {messages.map((message: ChatMessageType, key: number) => <ChatMessage key={key} message={message}></ChatMessage>)}
                <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={sendMessage} className='chat-form'>
                <input type="text" placeholder="Type a message"></input>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}