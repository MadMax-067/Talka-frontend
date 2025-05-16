import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoSend, IoClose } from "react-icons/io5";
import SenderBubble from './SenderBubble';
import ReceiverBubble from './ReceiverBubble';
import CustomScrollbar from './CustomScrollbar';
import useSocketMessages from "@/hooks/useSocketMessages";
import { useRouter } from 'next/navigation';

const ChatSection = ({ chatData, conversationData, currentUserId }) => {
    const scrollContainerRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const router = useRouter();
    const { sendMessage } = useSocketMessages(currentUserId);
    const firstLoadRef = useRef(true);

    // Scroll to bottom for new messages
    useEffect(() => {
        if (scrollContainerRef.current && chatData.length > 0) {
            const scrollElement = scrollContainerRef.current.querySelector('.ps');
            if (scrollElement) {
                // Always scroll on first load
                if (firstLoadRef.current) {
                    scrollElement.scrollTop = scrollElement.scrollHeight;
                    firstLoadRef.current = false;
                    return;
                }

                // For subsequent messages, check if we're near bottom
                const isNearBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 100;
                
                if (isNearBottom) {
                    // Use setTimeout to ensure DOM is updated
                    setTimeout(() => {
                        scrollElement.scrollTop = scrollElement.scrollHeight;
                    }, 0);
                }
            }
        }

        // Reset firstLoad when conversation changes
        return () => {
            firstLoadRef.current = true;
        };
    }, [chatData]);

    const handleSend = () => {
        if (conversationData?.friend?.clerkId && msgInput.trim()) {
            sendMessage(conversationData.friend.clerkId, msgInput.trim());
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

    return (
        <section className="w-3/4 h-[calc(100dvh-5rem)] flex flex-col overflow-hidden">

            <section className="flex justify-between items-center px-6 min-h-16 border-b-2 border-b-(--border-lines) bg-(--bg)">
                <div className="flex items-center gap-3">
                    <Image className="rounded-full object-cover w-10 h-10" 
                        src={conversationData?.friend?.avatar} 
                        alt={conversationData?.friend?.fullName} 
                        width={64} height={64} 
                    />
                    <span className="text-xl text-(--primary-text)">
                        {conversationData?.friend?.fullName}
                    </span>
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
                                    setShowMenu(false);
                                    router.push('/talk');
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

            <div ref={scrollContainerRef} className="flex-1 min-h-0">
                <CustomScrollbar>
                    <div className="flex flex-col p-4">
                        {chatData.map((msg, index) => {
                            
                            const isConsecutive = index > 0 && 
                                chatData[index - 1].from === msg.from &&
                                ((new Date(msg.createdAt) - new Date(chatData[index - 1].createdAt)) < 120000); // 2 minutes threshold

                            
                            const isLastInGroup = index === chatData.length - 1 || 
                                chatData[index + 1]?.from !== msg.from ||
                                ((new Date(chatData[index + 1]?.createdAt) - new Date(msg.createdAt)) >= 120000);

                            return msg.from === currentUserId ? (
                                <SenderBubble
                                    key={msg.id}
                                    chat={msg}
                                    isConsecutive={isConsecutive}
                                    showTime={isLastInGroup}
                                />
                            ) : (
                                <ReceiverBubble
                                    key={msg.id}
                                    chat={msg}
                                    isConsecutive={isConsecutive}
                                    showTime={isLastInGroup}
                                />
                            );
                        })}
                    </div>
                </CustomScrollbar>
            </div>

            
            <div className="px-4 py-3 border-t border-t-(--border-lines) bg-(--bg)">
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