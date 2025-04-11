// utils/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
    if (!socket || !socket.connected) {
        socket = io("http://localhost:8000", {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token, // Clerk JWT
            },
        });
    }
    return socket;
};

export const getSocket = () => socket;
