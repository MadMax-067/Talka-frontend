"use client";
import React, { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

const SocketTester = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handlePong = (data) => {
      console.log("📥 Pong from server:", data);
    };

    socket.emit("ping", { message: "Hello from frontend" });
    socket.on("pong", handlePong);

    return () => {
      socket.off("pong", handlePong);
    };
  }, [socket]);

  return (
    <div className="p-4 bg-green-100 text-black">
      <h2 className="text-xl font-bold">Socket.IO Test</h2>
      <p>Open console to see logs.</p>
    </div>
  );
};

export default SocketTester;
