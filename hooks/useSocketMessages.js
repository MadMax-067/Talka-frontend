"use client";

import { useEffect, useState, useCallback } from "react";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useSocket } from "@/context/SocketContext";
import generateConversationId from "@/utils/generateConversationId";
import axios from "axios";

export default function useSocketMessages(currentUserId) {
    const { socket, conversations, setConversations, setConversationLoading, setMessages, selectedConversation } = useSocket();
    const [messagesMap, setMessagesMap] = useState({});
    const [unreadMap, setUnreadMap] = useState({});
    const [typingMap, setTypingMap] = useState({});
    const [presenceMap, setPresenceMap] = useState({});

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setConversationLoading(true);
                const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/conversations/${currentUserId}`);
                setConversations(result.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setConversationLoading(false);
            }
        };

        if (socket) fetchConversations();
    }, [socket]);

    const sendMessage = useCallback((toUser, content) => {
        const toUserId = toUser.clerkId;
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

        // Update both local messages and context messages
        setMessagesMap((prev) => {
            const currentMessages = prev[conversationId] || [];
            return {
                ...prev,
                [conversationId]: [...currentMessages, newMessage],
            };
        });

        // Update messages in context
        setMessages(prev => [...prev, newMessage]);

        // Update conversation list
        setConversations((prev) => {
            const others = prev.filter(c => c.conversationId !== conversationId);
            const currentConv = prev.find(c => c.conversationId === conversationId);
            if (currentConv) {
                const updated = {
                    ...currentConv,
                    lastMessage: content,
                    lastUpdated: new Date().toISOString()
                };
                return [updated, ...others];
            } else {
                const currentConv = {
                    conversationId,
                    friend: toUser,
                    lastMessage: content,
                    lastUpdated: newMessage.createdAt,
                    unreadCount: 1
                };
                return [currentConv, ...others];
            }

        });

        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { toUserId, content });
    }, [socket, currentUserId, setMessages]);

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

        const handleNewMessage = ({ conversationData, message }) => {
            const { conversationId } = message;

            const isFromOther = message.from !== currentUserId;
            const isConversationOpen = selectedConversation && selectedConversation.conversationId === conversationId;

            // Update messages in both maps and context
            // setMessagesMap((prev) => {
            //     return {
            //         ...prev,
            //         [conversationId]: [...prev[conversationId], message],
            //     };
            // });

            // Update context messages
            // Update context messages with proper checking
            if (isConversationOpen && isFromOther) {
                setMessages(prev => {
                    // Skip if previous state is already correct (prevents unnecessary re-renders)
                    if (prev.length > 0 && prev[prev.length - 1]._id === message._id) {
                        return prev;
                    }

                    // Check if current message exists to avoid duplicates
                    const messageExists = prev.some(msg => msg._id === message._id);
                    if (messageExists) {
                        return prev;
                    }

                    return [...prev, message];
                });
            }
            // setMessages(prev => {
            //     const filteredMessages = prev.filter(msg => !msg._id.startsWith('temp-'));
            //     return [...filteredMessages, message];
            // });

            // Update conversations list
            setConversations((prev) => {
                const others = prev.filter(c => c.conversationId !== conversationId);
                const currentConv = prev.find(c => c.conversationId === conversationId);

                if (currentConv) {
                    const updated = {
                        ...currentConv,
                        lastMessage: message.content,
                        lastUpdated: message.createdAt,
                        unreadCount: isFromOther && !isConversationOpen ?
                            (currentConv.unreadCount || 0) + 1 :
                            currentConv.unreadCount
                    };
                    return [updated, ...others].sort((a, b) =>
                        new Date(b.lastUpdated) - new Date(a.lastUpdated)
                    );
                } else {
                    const updated = {
                        ...conversationData[0],
                        unreadCount: isFromOther && !isConversationOpen ?
                            (conversationData[0].unreadCount || 0) + 1 :
                            conversationData[0].unreadCount
                    };
                    return [updated, ...others].sort((a, b) =>
                        new Date(b.lastUpdated) - new Date(a.lastUpdated)
                    );
                }
            });

            // Mark message as read if conversation is open and message is from someone else
            if (isFromOther && isConversationOpen) {
                markConversationRead(conversationId);

                // Update local unread state immediately for UI
                setUnreadMap(prev => ({
                    ...prev,
                    [conversationId]: 0
                }));
            } else if (isFromOther) {
                // Only update unread map if message is not from current user and conversation is not open
                setUnreadMap(prev => ({
                    ...prev,
                    [conversationId]: (prev[conversationId] || 0) + 1
                }));
            }
        };

        const handleMessageRead = ({ conversationId, messageIds }) => {

            setMessages(prev => {

                // Mark messages as read
                return prev.map(msg => {
                    if (messageIds.includes(msg._id)) {
                        return { ...msg, read: true };
                    }
                    if (msg._id.startsWith('temp-') && msg.from === currentUserId) {
                        return { ...msg, read: true };
                    }

                    return msg;
                });
            });
        };

        const handleMessageHistory = ({ conversationId, messages, page }) => {
            setMessagesMap((prev) => ({
                ...prev,
                [conversationId]: page === 0 ? messages : [...(prev[conversationId] || []), ...messages],
            }));

            // Update context messages directly
            setMessages(messages);
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
        socket.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
        socket.on(SOCKET_EVENTS.TYPING, handleTyping);
        socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
        socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
        socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
        socket.on(SOCKET_EVENTS.CONVERSATION_UPDATE, handleConversationUpdate);

        return () => {
            socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
            socket.off(SOCKET_EVENTS.MESSAGE_HISTORY, handleMessageHistory);
            socket.off(SOCKET_EVENTS.UPDATE_UNREAD_COUNT, handleUnreadCount);
            socket.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
            socket.off(SOCKET_EVENTS.TYPING, handleTyping);
            socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
            socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
            socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
            socket.off(SOCKET_EVENTS.CONVERSATION_UPDATE, handleConversationUpdate);
        };
    }, [socket]);
    return { messagesMap, unreadMap, typingMap, presenceMap, sendMessage, markConversationRead, getMessages, emitTyping, emitStopTyping, setUnreadMap };
}