"use client"
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs';
import ChatPlaceholder from '@/components/ChatPlaceholder'
import Sidebar from '@/components/Sidebar'
import ChatSection from '@/components/ChatSection';
import { useEffect, useState } from 'react'
import { useSocket } from "@/context/SocketContext";
import useSocketMessages from "@/hooks/useSocketMessages";

function Page() {
    const { user, isLoaded: isAuthLoaded } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTimerId, setLoadingTimerId] = useState(null);
    
    // Always access the socket context - never conditionally
    const { 
        selectedConversation, 
        setSelectedConversation, 
        messages, 
        setMessages, 
        isMobile 
    } = useSocket() || {}; // Use nullish coalescing to handle potential undefined
    
    // Safely access hooks even if user is null - just don't use the values yet
    const { getMessages } = useSocketMessages(user?.id || '');

    // Check auth status only after Clerk has loaded
    useEffect(() => {
        if (isAuthLoaded && !user) {
            router.replace('/');
        }
    }, [isAuthLoaded, user, router]);
    
    // Load messages when conversation changes with minimum loading time
    useEffect(() => {
        if (!user || !selectedConversation) return;
        
        // Clear any existing timer
        if (loadingTimerId) {
            clearTimeout(loadingTimerId);
        }
        
        // Set loading to true immediately
        setIsLoading(true);
        
        // Minimum loading time (in milliseconds)
        const MIN_LOADING_TIME = 800;
        
        // Record the start time
        const startTime = Date.now();
        
        const loadMessages = async () => {
            try {
                const conversationId = selectedConversation.conversationId;
                
                // Load messages
                await getMessages(conversationId);
                
                // Calculate how long the loading has been shown
                const elapsedTime = Date.now() - startTime;
                
                // If loading time has been shorter than minimum, wait the remaining time
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                
                // Set a timer to hide loading state after the remaining time
                const timerId = setTimeout(() => {
                    setIsLoading(false);
                }, remainingTime);
                
                setLoadingTimerId(timerId);
                
            } catch (error) {
                console.error('Error loading messages:', error);
                // Still respect minimum loading time on error
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                
                const timerId = setTimeout(() => {
                    setIsLoading(false);
                }, remainingTime);
                
                setLoadingTimerId(timerId);
            }
        };
        
        loadMessages();
        
        // Clean up the timer on unmount or when conversation changes
        return () => {
            if (loadingTimerId) {
                clearTimeout(loadingTimerId);
            }
        };
    }, [selectedConversation?.conversationId, getMessages, user]);

    // Don't render main content until auth is checked
    if (!isAuthLoaded || !user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-4 border-t-(--send-bubble-bg) border-(--border-lines) rounded-full animate-spin mb-4"></div>
            </div>
        );
    }

    return (
        <>
            {(!isMobile || !selectedConversation) && <Sidebar />}
            
            {selectedConversation ? (
                <ChatSection 
                    currentUserId={user.id}
                    conversationData={selectedConversation}
                    chatData={messages}
                    isLoading={isLoading}
                    key={selectedConversation.conversationId}
                />
            ) : (
                <ChatPlaceholder />
            )}
        </>
    );
}

export default Page;