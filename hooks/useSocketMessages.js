"use client";

import { useEffect, useState, useCallback } from "react";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useSocket } from "@/context/SocketContext";
import generateConversationId from "@/utils/generateConversationId";
import axios from "axios";

export default function useSocketMessages(currentUserId) {
    const { socket, conversations, setConversations, setConversationLoading } = useSocket();
    const [messagesMap, setMessagesMap] = useState({});
    const [unreadMap, setUnreadMap] = useState({});
    const [typingMap, setTypingMap] = useState({});
    const [presenceMap, setPresenceMap] = useState({});

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setConversationLoading(true);
                const result = await axios.get(`http://localhost:8000/api/v1/conversations/${currentUserId}`);
                setConversations(result.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setConversationLoading(false);
            }
        };

        if (socket) fetchConversations();
    }, [socket]);

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
        
        // Immediately update messages in current chat
        setMessagesMap((prev) => {
            const currentMessages = prev[conversationId] || [];
            return {
                ...prev,
                [conversationId]: [...currentMessages, newMessage],
            };
        });

        // Update conversation list
        setConversations((prev) => {
            const others = prev.filter(c => c.conversationId !== conversationId);
            const currentConv = prev.find(c => c.conversationId === conversationId);
            const updated = {
                ...currentConv,
                lastMessage: content,
                lastUpdated: new Date().toISOString()
            };
            return [updated, ...others];
        });

        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { toUserId, content });
    }, [socket, currentUserId]);

    const markConversationRead = useCallback((conversationId) => {
        if (!socket || !conversationId) return;
        socket.emit(SOCKET_EVENTS.MARK_READ, { conversationId });
    }, [socket]);

    const getMessages = useCallback((conversationId, page = 0) => {
        if (!socket || !conversationId) return;
        socket.emit(SOCKET_EVENTS.GET_MESSAGES, { conversationId, page });
    }, [socket]);

    const emitTyping = useCallback((toUserId) => {
        if (!socket || !toUserId) return;
        socket.emit(SOCKET_EVENTS.TYPING, { toUserId });
    }, [socket]);

    const emitStopTyping = useCallback((toUserId) => {
        if (!socket || !toUserId) return;
        socket.emit(SOCKET_EVENTS.STOP_TYPING, { toUserId });
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            const { conversationId } = message;
            
            // Update messages immediately for open chats
            setMessagesMap((prev) => {
                const currentMessages = prev[conversationId] || [];
                // Remove temp message if it exists
                const filteredMessages = currentMessages.filter(msg => !msg._id.startsWith('temp-'));
                return {
                    ...prev,
                    [conversationId]: [...filteredMessages, message],
                };
            });

            // Update conversations list with latest message
            setConversations((prev) => {
                const others = prev.filter(c => c.conversationId !== conversationId);
                const currentConv = prev.find(c => c.conversationId === conversationId);
                if (!currentConv) return prev;

                const updated = {
                    ...currentConv,
                    lastMessage: message.content,
                    lastUpdated: message.createdAt,
                    unreadCount: message.from !== currentUserId ? 
                        (currentConv.unreadCount || 0) + 1 : 
                        currentConv.unreadCount
                };
                return [updated, ...others];
            });

            // Update unread count for incoming messages
            if (message.from !== currentUserId) {
                setUnreadMap((prev) => ({
                    ...prev,
                    [conversationId]: (prev[conversationId] || 0) + 1
                }));
            }
        };

        const handleMessageHistory = ({ conversationId, messages, page }) => {
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

        const handleTyping = ({ fromUserId }) => {
            setTypingMap((prev) => ({ ...prev, [fromUserId]: true }));
        };

        const handleStopTyping = ({ fromUserId }) => {
            setTypingMap((prev) => ({ ...prev, [fromUserId]: false }));
        }

        const handleUserOnline = (userId) => {
            setPresenceMap((prev) => ({ ...prev, [userId]: true }));
        }

        const handleUserOffline = ({ userId, lastSeen }) => {
            setPresenceMap((prev) => ({ ...prev, [userId]: false, lastSeen }));
        }

        const handleConversationUpdate = (update) => {
            setConversations((prev) => {
                const others = prev.filter(c => c.conversationId !== update.conversationId);
                const updated = {
                    ...prev.find(c => c.conversationId === update.conversationId),
                    ...update,
                };
                if (!updated) return prev;

                return [updated, ...others].sort((a, b) =>
                    new Date(b.lastUpdated) - new Date(a.lastUpdated)
                );
            });
        };

        socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
        socket.on(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
        socket.on(SOCKET_EVENTS.UPDATE_UNREAD_COUNT, handleUnreadCount);
        socket.on(SOCKET_EVENTS.TYPING, handleTyping);
        socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
        socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
        socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
        socket.on(SOCKET_EVENTS.CONVERSATION_UPDATE, handleConversationUpdate);

        return () => {
            socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
            socket.off(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
            socket.off(SOCKET_EVENTS.UPDATE_UNREAD_COUNT, handleUnreadCount);
            socket.off(SOCKET_EVENTS.TYPING, handleTyping);
            socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
            socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
            socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
            socket.off(SOCKET_EVENTS.CONVERSATION_UPDATE, handleConversationUpdate);
        };
    }, [socket]);
    return { messagesMap, unreadMap, typingMap, presenceMap, sendMessage, markConversationRead, getMessages, emitTyping, emitStopTyping };
}