import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend, IoClose, IoChevronBack } from "react-icons/io5";
import SenderBubble from './SenderBubble';
import ReceiverBubble from './ReceiverBubble';
import CustomScrollbar from './CustomScrollbar';
import useSocketMessages from "@/hooks/useSocketMessages";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from 'next/navigation';

// Add this function to your component or utils
const formatLastSeen = (lastSeenDate) => {
    const lastSeen = new Date(lastSeenDate);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return lastSeen.toLocaleDateString();
};

const ChatSection = ({ chatData, conversationData, currentUserId, isLoading = false }) => {
    const scrollContainerRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const router = useRouter();
    const { sendMessage } = useSocketMessages(currentUserId);
    const firstLoadRef = useRef(true);
    const { setSelectedConversation, isMobile } = useSocket();
    const inputBarRef = useRef(null);
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    // Scroll to bottom for new messages
       // Update the scrolling behavior in ChatSection.js
    
    // Replace your existing scroll-to-bottom useEffect with this enhanced version
    useEffect(() => {
        // Function to scroll to bottom
        const scrollToBottom = () => {
            if (!scrollContainerRef.current) return;
            
            const scrollElement = scrollContainerRef.current.querySelector('.ps');
            if (!scrollElement) return;
            
            // Wait a bit for render to complete
            setTimeout(() => {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }, 100);
        };
    
        // Check if we can scroll (container exists and has messages)
        if (scrollContainerRef.current && chatData.length > 0) {
            const scrollElement = scrollContainerRef.current.querySelector('.ps');
            
            if (scrollElement) {
                // Always scroll on first load of a conversation
                if (firstLoadRef.current) {
                    scrollToBottom();
                    firstLoadRef.current = false;
                    return;
                }
    
                // For subsequent messages, check if we're near bottom before auto-scrolling
                const isNearBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 200;
                
                if (isNearBottom) {
                    scrollToBottom();
                }
            }
        }
    
        // Reset firstLoad when conversation changes
        return () => {
            firstLoadRef.current = true;
        };
    }, [chatData, conversationData?.conversationId]); // Add conversationId to deps to detect conversation changes
    
    // Add a new useEffect specifically for scrolling when a conversation is opened
    useEffect(() => {
        // Only run this when conversationData changes (conversation is opened/switched)
        if (conversationData?.conversationId && !isLoading) {
            // Short delay to ensure component is fully rendered
            const timerId = setTimeout(() => {
                if (scrollContainerRef.current) {
                    const scrollElement = scrollContainerRef.current.querySelector('.ps');
                    if (scrollElement) {
                        scrollElement.scrollTop = scrollElement.scrollHeight;
                    }
                }
            }, 200);
            
            return () => clearTimeout(timerId);
        }
    }, [conversationData?.conversationId, isLoading]);

    // Enhanced calculation for chat area height that also detects keyboard
       // Update the keyboard handling in your updateChatAreaHeight function
    const updateChatAreaHeight = () => {
        if (isMobile) {
            const header = document.querySelector('.chat-header');
            const inputBar = document.querySelector('.input-bar');
            
            if (header && inputBar && scrollContainerRef.current) {
                const headerHeight = header.offsetHeight;
                const inputHeight = inputBar.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Visual viewport helps detect keyboard presence on mobile
                const visualViewportHeight = window.visualViewport?.height || windowHeight;
                
                // If visual viewport is significantly smaller than window, keyboard is likely open
                const isKeyboardOpen = windowHeight - visualViewportHeight > 100;
                
                // Only update state if there's a change to prevent unnecessary renders
                if (keyboardOpen !== isKeyboardOpen) {
                    setKeyboardOpen(isKeyboardOpen);
                    
                    // When keyboard opens or closes, scroll to bottom after a brief delay
                    if (chatData.length > 0) {
                        setTimeout(() => {
                            const scrollElement = scrollContainerRef.current?.querySelector('.ps');
                            if (scrollElement) {
                                scrollElement.scrollTop = scrollElement.scrollHeight;
                            }
                        }, 300); // Longer timeout to account for keyboard animation
                    }
                }
                
                // Calculate remaining height for chat area
                const availableHeight = isKeyboardOpen 
                    ? visualViewportHeight - headerHeight - inputHeight 
                    : windowHeight - headerHeight - inputHeight;
                
                // Apply calculated height directly
                scrollContainerRef.current.style.height = `${Math.max(100, availableHeight)}px`;
            }
        } else {
            // Reset height on desktop
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.height = '';
            }
        }
    };

    const handleSend = () => {
        if (conversationData?.friend?.clerkId && msgInput.trim()) {
            sendMessage(conversationData.friend, msgInput.trim());
            setMsgInput('');

            // Force scroll to bottom on send
            if (scrollContainerRef.current) {
                const scrollElement = scrollContainerRef.current.querySelector('.ps');
                if (scrollElement) {
                    setTimeout(() => {
                        scrollElement.scrollTop = scrollElement.scrollHeight;
                    }, 0);
                }
            }
        }
    };

    // Add keyboard handler for Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Enhanced loading state with animation
    if (isLoading) {
        return (
            <section className="w-full h-[calc(100dvh)] md:h-[calc(100dvh-5rem)] md:w-3/4 flex flex-col items-center justify-center overflow-hidden bg-(--bg)">
                <div className="flex flex-col items-center justify-center">
                    {/* Enhanced floating chat bubbles animation */}
                    <div className="relative w-32 h-32 mb-6">
                        {/* More bubbles with staggered animations */}
                        <div className="absolute left-0 top-6 w-6 h-6 bg-(--send-bubble-bg) rounded-full animate-float opacity-80"></div>
                        <div className="absolute left-8 top-2 w-8 h-8 bg-(--send-bubble-bg) rounded-full animate-float-delay opacity-90"></div>
                        <div className="absolute right-8 top-8 w-5 h-5 bg-(--send-bubble-bg) rounded-full animate-float-delay-2"></div>
                        <div className="absolute right-0 top-4 w-7 h-7 bg-(--send-bubble-bg) rounded-full animate-float-delay-3 opacity-70"></div>
                        <div className="absolute left-10 bottom-0 w-4 h-4 bg-(--send-bubble-bg) rounded-full animate-float opacity-60" 
                             style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute right-10 bottom-2 w-5 h-5 bg-(--send-bubble-bg) rounded-full animate-float-delay-2 opacity-75"
                             style={{ animationDelay: '0.7s' }}></div>
                        
                        {/* Glowing effect under the avatar */}
                        <div className="absolute inset-7 rounded-full animate-pulse-glow"></div>
                        
                        {/* Avatar circle in middle with appear animation */}
                        <div className="absolute inset-7 rounded-full bg-white flex items-center justify-center shadow-md animate-avatar-appear overflow-hidden">
                            {conversationData?.friend?.avatar ? (
                                <img 
                                    src={conversationData.friend.avatar} 
                                    alt={conversationData.friend.fullName}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 rounded-full"></div>
                            )}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-(--primary-text) mb-2 animate-pulse">
                        {conversationData?.friend?.fullName || "Loading conversation..."}
                    </h3>
                    
                    {/* Animated ellipsis */}
                    <div className="flex space-x-2 mb-6">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-(--send-bubble-bg)"
                                style={{ 
                                    animation: `bounce 1.4s infinite ease-in-out both`,
                                    animationDelay: `${i * 0.16}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Add keyframes for the bounce animation */}
                <style jsx global>{`
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                        40% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </section>
        );
    }

    if (!conversationData) {
        return (
            <section className="w-full h-[calc(100dvh)] md:h-[calc(100dvh-5rem)] md:w-3/4 flex flex-col items-center justify-center overflow-hidden bg-(--bg)">
                <div className="flex flex-col items-center">
                    {/* Pulsating circle animation */}
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 rounded-full bg-(--send-bubble-bg) opacity-25 animate-ping" />
                        <div className="absolute inset-2 rounded-full bg-(--send-bubble-bg) opacity-50 animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-(--send-bubble-bg) opacity-75" />
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Loading text */}
                    <p className="text-lg text-(--primary-text) font-medium animate-pulse">
                        Loading conversation...
                    </p>

                    {/* Animated dots */}
                    <div className="flex mt-3 space-x-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-(--secondary-text)"
                                style={{ animation: `bounce 1.4s infinite ease-in-out both`, animationDelay: `${i * 0.16}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Add some global styles for the animation */}
                <style jsx global>{`
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                        40% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </section>
        );
    }

    return (
        <section className="w-full h-[calc(100dvh)] md:h-[calc(100dvh-5rem)] md:w-3/4 flex flex-col overflow-hidden">
            {/* Add the chat-header class to header for height calculations */}
            <section className="chat-header flex justify-start items-center px-3 md:px-6 min-h-16 border-b-2 border-b-(--border-lines) bg-(--bg)">
                {isMobile && (
                    <button
                        onClick={() => {
                            setSelectedConversation(null);
                        }}
                        className="p-2 hover:bg-(--hover-bg) rounded-full transition-colors"
                    >
                        <IoChevronBack className="size-5 text-(--secondary-text)" />
                    </button>
                )}
                <div className="flex items-center gap-3 mr-auto">
                    <Image 
                        className="rounded-full object-cover w-10 h-10"
                        src={conversationData?.friend?.avatar}
                        alt={conversationData?.friend?.fullName}
                        width={64} 
                        height={64}
                    />
                    <div className="flex flex-col">
                        <span className="text-xl text-(--primary-text) truncate max-w-[150px] sm:max-w-[250px]">
                            {conversationData?.friend?.fullName}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                            {conversationData?.friend?.isOnline ? (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span className="text-(--secondary-text)">Online</span>
                                </>
                            ) : (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                    <span className="text-(--secondary-text)">
                                        {conversationData?.friend?.lastSeen 
                                            ? `Last seen ${formatLastSeen(conversationData.friend.lastSeen)}`
                                            : 'Offline'
                                        }
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 hover:bg-(--hover-bg) rounded-full transition-colors"
                    >
                        <HiOutlineDotsVertical className="size-6 text-(--secondary-text)" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 py-2 bg-(--card-bg) rounded-xl border border-(--border-lines) shadow-lg z-50">
                            <button
                                onClick={() => {
                                    setSelectedConversation(null);
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-(--hover-bg) text-(--primary-text)"
                            >
                                <IoClose className="size-5" />
                                <span>Close Talk</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Use flex-1 min-h-0 to allow for dynamic height calculation in JS */}
            <div 
                ref={scrollContainerRef} 
                className={`flex-1 min-h-0 ${keyboardOpen ? 'keyboard-open' : ''}`}
            >
                <CustomScrollbar>
                    <div className="flex flex-col p-4">
                        {chatData.length > 0 ? (
                            chatData.map((msg, index) => {

                                const isConsecutive = index > 0 &&
                                    chatData[index - 1].from === msg.from &&
                                    ((new Date(msg.createdAt) - new Date(chatData[index - 1].createdAt)) < 120000); // 2 minutes threshold


                                const isLastInGroup = index === chatData.length - 1 ||
                                    chatData[index + 1]?.from !== msg.from ||
                                    ((new Date(chatData[index + 1]?.createdAt) - new Date(msg.createdAt)) >= 120000);

                                return msg.from === currentUserId ? (
                                    <SenderBubble
                                        key={msg._id}
                                        chat={msg}
                                        isConsecutive={isConsecutive}
                                        showTime={isLastInGroup}
                                    />
                                ) : (
                                    <ReceiverBubble
                                        key={msg._id}
                                        chat={msg}
                                        isConsecutive={isConsecutive}
                                        showTime={isLastInGroup}
                                    />
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16">
                                <div className="w-20 h-20 rounded-full bg-(--input-color) flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-(--secondary-text)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-(--primary-text) mb-2">
                                    No messages yet
                                </h3>
                                <p className="text-center text-sm text-(--secondary-text) max-w-sm mb-6">
                                    Say hello to {conversationData?.friend?.fullName} to start the conversation!
                                </p>
                                <button 
                                    onClick={() => {
                                        setMsgInput("👋 Hello!");
                                        // Focus the input field
                                        setTimeout(() => {
                                            document.querySelector('input[type="text"]').focus();
                                        }, 0);
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-(--send-bubble-bg) text-white hover:opacity-90 transition-opacity"
                                >
                                    <span>Send a greeting</span>
                                </button>
                            </div>
                        )}
                    </div>
                </CustomScrollbar>
            </div>

            {/* Add the input-bar class for height calculations */}
            <div className="input-bar px-4 py-3 border-t border-t-(--border-lines) bg-(--bg)">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--input-bg) text-(--primary-text) border-2 border-(--border-lines) hover:border-(--hover-border) transition-colors">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 bg-transparent outline-none"
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSend} className="p-1 hover:bg-(--hover-bg) rounded-full transition-colors">
                        <IoSend className="size-5 text-(--primary-text)" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatSection