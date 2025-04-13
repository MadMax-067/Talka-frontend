"use client";

import { useEffect, useState, useCallback } from "react";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useSocket } from "@/context/SocketContext";
import generateConversationId from "@/utils/generateConversationId";

export default function useSocketMessages(currentUserId) {
    const socket = useSocket();
    const [messagesMap, setMessagesMap] = useState({});
    const [unreadMap, setUnreadMap] = useState({});

    const sendMessage = useCallback((toUserId, content) => {
        if (!socket || !toUserId || !content) return;
        const conversationId = generateConversationId(currentUserId, toUserId);
        const newMessage = {
            _id: `temp-${Date.now()}`,
            conversationId,
            from: currentUserId,
            to: toUserId,
            content,
            createdAt: new Date().toISOString(),
            read: false,
        };
        setMessagesMap((prev) => ({ ...prev, [conversationId]: [...(prev[conversationId] || []), newMessage], }));
        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { toUserId, content });
    }, [socket]);

    const markConversationRead = useCallback((conversationId) => {
        if (!socket || !conversationId) return;
        socket.emit(SOCKET_EVENTS.MARK_READ, { conversationId });
    }, [socket]);

    const getMessages = useCallback((conversationId, page = 0) => {
        if (!socket || !conversationId) return;
        socket.emit(SOCKET_EVENTS.GET_MESSAGES, { conversationId, page });
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (message) => {
            const { conversationId } = message;
            setMessagesMap((prev) => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), message],
            }));
        };

        const handleMessageHistory = ({ conversationId, messages, page }) => {
            console.log("Message history received:", messages);
            setMessagesMap((prev) => ({
                ...prev,
                [conversationId]: page === 0
                    ? messages
                    : [...(prev[conversationId] || []), ...messages],
            }));
        };

        const handleUnreadCount = ({ conversationId, count }) => {
            setUnreadMap((prev) => ({
                ...prev,
                [conversationId]: count,
            }));
        };

        socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
        socket.on(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
        socket.on(SOCKET_EVENTS.UPDATE_UNREAD_COUNT, handleUnreadCount);

        return () => {
            socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
            socket.off(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
            socket.off(SOCKET_EVENTS.UPDATE_UNREAD_COUNT, handleUnreadCount);
        };
    }, [socket]);
    return { messagesMap, unreadMap, sendMessage, markConversationRead, getMessages, };
}