"use client";
import React, { useEffect } from 'react'
import socket from '@/utils/socket.js';


const SocketTester = () => {

    useEffect(() => {

        const handleConnect = () => {
            console.log("🟢 Connected to Socket.IO", socket.id);
            socket.emit("ping", { message: "Hello from frontend" });
        };

        const handlePong = (data) => {
            console.log("📥 Pong from server:", data);
        };

        const handleDisconnect = () => {
            console.log("🔴 Socket disconnected");
        };

        const handleConnectError = (err) => {
            console.error("⚠️ Socket connection error:", err.message);
        };

        // If already connected, call handler immediately
        if (socket.connected) {
            handleConnect();
        } else {
            socket.on("connect", handleConnect);
        }

        socket.on("pong", handlePong);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("pong", handlePong);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.disconnect();
        };
    }, []);


    return (
        <div className="p-4 bg-green-100 text-black">
            <h2 className="text-xl font-bold">Socket.IO Test</h2>
            <p>Open console to see logs.</p>
        </div>
    )
}

export default SocketTester
