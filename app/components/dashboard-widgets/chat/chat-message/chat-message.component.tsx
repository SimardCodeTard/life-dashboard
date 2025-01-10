import { ChatMessageType } from "@/app/types/chat.type";
import Image from "next/image";

export default function ChatMessage({message}: {message: ChatMessageType}) {
    let imagePath = '';
    let senderName = '';

    switch(message.role) {
        case 'user':
            imagePath = '/assets/user.png';
            senderName = 'You';
            break;
        case 'assistant':
            imagePath = '/assets/luna.png';
            senderName = 'Luna';
            break;
        case 'system':
            return <></>
    }

    return (
        <div className='flex flex-row items-center'>
            <div className='flex items-start'>
                <Image src={imagePath} alt="" height={40} width={40} className="rounded-md"></Image>
                <span className="flex ml-2 flex-col space-y-2">
                    <p className='text-lg font-medium text-violet-600/80'>{senderName}</p>
                    <p className='text-sm'>{message.content}</p>
                </span>
            </div>
        </div>
    )

}