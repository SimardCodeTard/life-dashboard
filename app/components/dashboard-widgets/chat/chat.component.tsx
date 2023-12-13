'use client'

import styles from './chat.module.css';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { OpenAIClientService } from '@/app/services/client/openai-client.service';
import { Logger } from '@/app/services/logger.service';
import ChatMessage from './chat-message/chat-message.component';
import { ChatMessage as ChatMessageModel } from '@/app/types/chat.type';
import Loader from '../../shared/loader/loader.component';

export default function Chat() {

    const [messages, setMessages] = useState<ChatMessageModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsLoading(true);
        OpenAIClientService.startNewConversation().then(setMessages).then(() => setIsLoading(false)).catch(Logger.error)
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

        OpenAIClientService.sendMessage(message).then((messages: ChatMessageModel[]) => {
            setMessages(messages);
        }).then(() => setIsLoading(false)).catch(Logger.error);
    }

    return (
        <div className={[styles.chat].join(' ')}>
            <div className={['p-2 rounded h-full', styles.chatMessages].join(' ')}>
                {messages.map((message: ChatMessageModel, key: number) => <ChatMessage key={key} message={message}></ChatMessage>)}
                {isLoading && <Loader></Loader>}
                <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={sendMessage} className='p-2 flex h-fit flex-row justify-end items-end'>
                <input type="text" className="p-1 rounded bg-[rgba(255,255,255,0.2)]" placeholder="Type a message"></input>
                <button type="submit" className="ml-2 p-1 rounded bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.2)]">Send</button>
            </form>
        </div>
    )
}