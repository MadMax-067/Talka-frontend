"use client"
import { redirect } from 'next/navigation'
import { useUser } from "@clerk/nextjs";
import ChatSection from '@/components/ChatSection';
import Sidebar from '@/components/Sidebar';
import { useEffect } from 'react'
import useSocketMessages from "@/hooks/useSocketMessages";
import { useSocket } from "@/context/SocketContext";
import ChatPlaceholder from '@/components/ChatPlaceholder';

const Page = ({ params }) => {
    const { user } = useUser();
    const currentUserId = user?.id;
    
    if (!user) {
        redirect('/')
    }

    const { selectedConversation, setSelectedConversation, messages, setMessages, isMobile } = useSocket();
    const { getMessages } = useSocketMessages(currentUserId);

    useEffect(() => {
        const initializeChat = async () => {
            const { talkId } = await params;
                await getMessages(talkId);
        };

        initializeChat();
    }, [selectedConversation]);

    if (!selectedConversation) {
        return (
                <>
                    <Sidebar />
                    <ChatPlaceholder />
                </>
            )
    }

    return (
        <>
            {!isMobile && <Sidebar />}
            <ChatSection 
                currentUserId={currentUserId}
                conversationData={selectedConversation}
                chatData={messages}
            />
        </>
    )
}

export default Page