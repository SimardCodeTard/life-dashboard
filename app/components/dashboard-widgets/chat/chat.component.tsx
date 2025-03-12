'use client'

import { FormEvent, useEffect, useRef, useState } from 'react';
import { clientOpenAIService } from '@/app/services/client/openai-client.service';
import { Logger } from '@/app/services/logger.service';
import ChatMessage from './chat-message/chat-message.component';
import { ChatMessageType } from '@/app/types/chat.type';
import Loader from '../../shared/loader/loader.component';


import './chat.css';

export default function Chat() {

    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsLoading(true);
        clientOpenAIService.startNewConversation().then(setMessages).then(() => setIsLoading(false)).catch(Logger.error)
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const sendMessage = (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const message = (event.target as any)[0].value;
        (event.target as any)[0].value = "";

        clientOpenAIService.sendMessage(message).then((messages: ChatMessageType[]) => {
            setMessages(messages);
        }).then(() => setIsLoading(false)).catch(Logger.error);
    }

    return (
        <div className='chat'>
            <div className='chat-messages'>
                {messages.map((message: ChatMessageType, key: number) => <ChatMessage key={key} message={message}></ChatMessage>)}
                {isLoading && <Loader></Loader>}
                <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={sendMessage} className='chat-form'>
                <input type="text" placeholder="Type a message"></input>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}