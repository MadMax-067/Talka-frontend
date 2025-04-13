"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import useSocketMessages from "@/hooks/useSocketMessages";
import generateConversationId from "@/utils/generateConversationId";

import React from 'react'

const page = () => {
    const { user } = useUser();
    const currentUserId = user?.id;
    const [otherUserId, setOtherUserId] = useState("");
    const [input, setInput] = useState("");
    const [selectedConversationId, setSelectedConversationId] = useState("");
    const { messagesMap, unreadMap, sendMessage, markConversationRead, getMessages, } = useSocketMessages(currentUserId);

    const startChat = () => {
        const convId = generateConversationId(currentUserId, otherUserId);
        setSelectedConversationId(convId);
        getMessages(convId);
        markConversationRead(convId);
    };

    const handleSend = () => {
        if (otherUserId && input) {
            sendMessage(otherUserId, input);
            setInput("");
        }
    };

    const messages = messagesMap[selectedConversationId] || [];
    messages.map((msg) => {
        console.log("Message:", msg);
        console.log("Sender ID:", msg.from);
        console.log("Receiver ID:", msg.to);
        console.log("Content:", msg.content);
    });


    return (
        <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Test Chat</h1>
            <div className="mb-2">
                <input
                    placeholder="Other user ID"
                    value={otherUserId}
                    onChange={(e) => setOtherUserId(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button onClick={startChat} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Start Chat
                </button>
            </div>

            <div className="mb-2">
                <input
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button onClick={handleSend} className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full">
                    Send
                </button>
            </div>

            <div className="mt-4 text-black bg-gray-100 p-4 rounded h-64 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`mb-2 ${msg.from === currentUserId ? "text-right" : "text-left"
                            }`}
                    >
                        <span className="font-semibold">{msg.from === currentUserId ? "You" : "Them"}:</span>{" "}
                        {msg.content}
                    </div>
                ))}
            </div>

            {selectedConversationId && (
                <div className="mt-2 text-sm text-gray-500">
                    Unread Count: {unreadMap[selectedConversationId] || 0}
                </div>
            )}
        </div>
    )
}

export default page
