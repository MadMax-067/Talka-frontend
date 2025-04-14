import React from 'react'
import Image from 'next/image'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import SenderBubble from './SenderBubble';
import ReceiverBubble from './ReceiverBubble';
import CustomScrollbar from './CustomScrollbar';

const ChatSection = ({ conversationData }) => {
    return (
        <section className="w-3/4 max-h-[calc(100dvh-5rem)] flex flex-col">
            {/* Header Section */}
            <section className="flex justify-between items-center px-6 w-full min-h-16 border-b-2 border-b-(--border-lines)" >
                <div className="flex items-center gap-3" >
                    <Image className="rounded-full object-cover w-10 h-10" src={conversationData?.avatar} alt={conversationData?.fullName} width={64} height={64} />
                    <span className="text-xl text-(--primary-text)" >{conversationData ? conversationData?.name : "Jhon Doe"}</span>
                </div>
                <HiOutlineDotsVertical className="size-6 text-(--secondary-text)" />
            </section>

            
            <CustomScrollbar className="flex-1 h-[calc(100dvh-13rem)]">
                <div className="flex flex-col p-4">
                    <SenderBubble />
                    <ReceiverBubble />
                </div>
            </CustomScrollbar>

            {/* Message Input Section */}
            <div className="px-4 py-3 border-t border-t-(--border-lines)">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--input-bg) text-(--primary-text) border-2 border-(--border-lines) hover:border-(--hover-border) transition-colors">
                    <input 
                        type="text" 
                        placeholder="Type a message" 
                        className="flex-1 bg-transparent outline-none"
                    />
                    <button className="p-1 hover:bg-(--hover-bg) rounded-full transition-colors">
                        <IoSend className="size-5 text-(--primary-text)" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatSection