"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectSocket } from "@/utils/socket";
import { useAuth } from "@clerk/nextjs";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isSignedIn, getToken } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [conversationLoading, setConversationLoading] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            if (!isSignedIn) return;

            try {
                const token = await getToken();
                const sock = connectSocket(token);
                socketRef.current = sock;
                setSocket(sock);

                sock.on("connect", () => console.log("🟢 Socket connected:", sock.id));
                sock.on("disconnect", () => console.log("🔴 Socket disconnected"));
                sock.on("connect_error", (err) => console.error("⚠️ Socket error:", err.message));
            } catch (err) {
                console.error("❌ Failed to connect socket:", err);
            }

        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                setSocket(null);
                socketRef.current = null;
            }
        };
    }, [isSignedIn]);

    return (
        <SocketContext.Provider value={{ socket, conversations, setConversations, conversationLoading, setConversationLoading }}>
            {children}
        </SocketContext.Provider>
    );
};
