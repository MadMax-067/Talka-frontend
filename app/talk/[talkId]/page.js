"use client"
import { redirect } from 'next/navigation'
import { useUser } from "@clerk/nextjs";
import ChatSection from '@/components/ChatSection';
import Sidebar from '@/components/Sidebar';
import { useEffect } from 'react'
import useSocketMessages from "@/hooks/useSocketMessages";
import { useSocket } from "@/context/SocketContext";

const Page = ({ params }) => {
    const { user } = useUser();
    const currentUserId = user?.id;
    
    if (!user) {
        redirect('/')
    }

    const { selectedConversation, setSelectedConversation, messages, setMessages } = useSocket();
    const { getMessages } = useSocketMessages(currentUserId);

    useEffect(() => {
        const initializeChat = async () => {
            const { talkId } = await params;
            
            if (talkId && (!selectedConversation || selectedConversation.conversationId !== talkId)) {
                await getMessages(talkId);
            }
        };

        initializeChat();
    }, [selectedConversation]);

    if (!selectedConversation) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Sidebar />
            <ChatSection 
                currentUserId={currentUserId}
                conversationData={selectedConversation}
                chatData={messages}
            />
        </>
    )
}

export default Page