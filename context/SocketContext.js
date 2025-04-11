"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "@/utils/socket";
import { useAuth } from "@clerk/nextjs";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isSignedIn, getToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (isSignedIn) {
                const token = await getToken();
                const sock = connectSocket(token);
                setSocket(sock);

                sock.on("connect", () => console.log("🟢 Socket connected:", sock.id));
                sock.on("disconnect", () => console.log("🔴 Socket disconnected"));
                sock.on("connect_error", (err) => console.error("⚠️ Socket error:", err.message));
            }
        };

        init();

        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [isSignedIn]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
