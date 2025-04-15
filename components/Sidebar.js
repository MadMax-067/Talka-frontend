"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiLoader4Line, RiChatNewLine, RiUserAddLine } from "react-icons/ri";
import Conversation from "@/components/Conversation.js";
import CustomScrollbar from "@/components/CustomScrollbar";
import { useSocket } from "@/context/SocketContext";
import useSocketMessages from "@/hooks/useSocketMessages";

const Sidebar = () => {
    const { user } = useUser();
    const currentUserId = user?.id;
    const { conversations, conversationLoading } = useSocket();
    const socketDetails = useSocketMessages(currentUserId);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        // You can also emit this to your socket or update global state
    };

    useEffect(() => {
        console.log(conversations);
    }, [conversations]);

    return (
        <aside className="flex flex-col w-1/4 h-[calc(100dvh-5rem)] border-r-2 border-r-(--border-lines)">
            <section className="w-full min-h-16 flex justify-center items-center border-b-2 border-b-(--border-lines)" >
                <div className="flex justify-center items-center w-[calc(3.5/4*100%)] h-10 rounded-xl border-2 border-(--border-lines) bg-(--input-color)" >
                    <HiMagnifyingGlass className="size-6 mx-2 text-(--search-icon)" />
                    <input className="w-full h-full outline-0 placeholder:text-(--search-icon)/50" type="text" placeholder="Search" />
                </div>
            </section>
            <CustomScrollbar>
                {!conversationLoading ? (
                    conversations.length > 0 ? (
                        <div className="flex flex-col w-full">
                            {conversations.map((conv, idx) => (
                                <Conversation 
                                    key={conv.conversationId}
                                    conversationData={conv}
                                    isFirst={idx === 0}
                                    isActive={selectedConversation?.conversationId === conv.conversationId}
                                    onSelect={handleConversationSelect}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[calc(100dvh-13rem)] text-center px-6">
                            <div className="relative group cursor-pointer mb-6">
                                <div className="absolute inset-0 bg-(--primary-text) opacity-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                                <RiChatNewLine className="size-16 text-(--secondary-text)" />
                            </div>
                            <h3 className="text-lg font-semibold text-(--primary-text) mb-2">
                                Start a Conversation
                            </h3>
                            <p className="text-sm text-(--secondary-text) mb-6">
                                Connect with friends or start a new chat to begin messaging
                            </p>
                            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-(--send-bubble-bg) text-white hover:opacity-90 transition-opacity">
                                <RiUserAddLine className="size-5" />
                                <span>Find People</span>
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                        <RiLoader4Line className="size-8 text-(--secondary-text) animate-spin" />
                        <span className="text-sm text-(--secondary-text) mt-2">Loading conversations...</span>
                    </div>
                )}
            </CustomScrollbar>
        </aside>
    )
}

export default Sidebar;