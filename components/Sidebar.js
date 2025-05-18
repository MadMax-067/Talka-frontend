"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { HiMagnifyingGlass, HiArrowLeft } from "react-icons/hi2";
import { RiLoader4Line, RiChatNewLine, RiUserAddLine, RiUserSearchLine } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import Conversation from "@/components/Conversation.js";
import CustomScrollbar from "@/components/CustomScrollbar";
import { useSocket } from "@/context/SocketContext";
import useSocketMessages from "@/hooks/useSocketMessages";
import axios from "axios";
import generateConversationId from "@/utils/generateConversationId";

const Sidebar = () => {
    const { user } = useUser();
    const currentUserId = user?.id;
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('conversations'); // 'conversations' or 'people'
    const [searchingPeople, setSearchingPeople] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const {
        conversations,
        conversationLoading,
        selectedConversation,
        setSelectedConversation,
        setMessages
    } = useSocket();

    const {
        messagesMap,
        unreadMap,
        markConversationRead,
        getMessages,
        setUnreadMap
    } = useSocketMessages(currentUserId);

    const handleConversationSelect = async (conversation) => {
        console.log("select:")
        console.dir(conversation)
        setSelectedConversation(conversation);

        try {
            // Mark as read
            if (conversation.unreadCount > 0) {
                markConversationRead(conversation.conversationId);
                setUnreadMap(prev => ({
                    ...prev,
                    [conversation.conversationId]: 0
                }));
            }

            router.push(`/talk/${conversation.conversationId}`);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    useEffect(() => {
        if (selectedConversation && messagesMap[selectedConversation.conversationId]) {
            setMessages(messagesMap[selectedConversation.conversationId]);
        }
    }, [messagesMap, selectedConversation]);

    
    useEffect(() => {
        if (searchMode !== 'people') {
            setSearchResults([]);
        } else if (searchQuery.trim().length >= 2) {
            searchPeople(searchQuery);
        }
    }, [searchMode]);

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery.trim() || searchMode !== 'conversations') return true;

        const query = searchQuery.toLowerCase().trim();
        const fullName = conv?.friend?.fullName?.toLowerCase() || '';
        const username = conv?.friend?.username?.toLowerCase() || '';

        return fullName.includes(query) || username.includes(query);
    });

    // Update conversation display with unread counts
    const displayConversations = filteredConversations.map(conv => {
        const isSelected = selectedConversation?.conversationId === conv.conversationId;

        return {
            ...conv,
            // If conversation is selected, always show 0 unread
            unreadCount: isSelected ? 0 : (unreadMap[conv.conversationId] || conv.unreadCount || 0)
        };
    });

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);

        // If in people search mode, trigger search after typing
        if (searchMode === 'people' && e.target.value.trim().length >= 2) {
            searchPeople(e.target.value);
        }
    };

    // Clear search with Escape key
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchQuery('');
        }
    };

    // Switch to people search mode
    const switchToPeopleSearch = () => {
        setSearchMode('people');
        setSearchResults([]);
        setSearchingPeople(false);
        
        // If we already have a search query, execute the search
        if (searchQuery.trim().length >= 2) {
            // Use setTimeout to ensure state updates before search
            setTimeout(() => {
                searchPeople(searchQuery);
            }, 0);
        }
        
        // Focus on the search input
        setTimeout(() => {
            const inputEl = document.querySelector('input[type="text"]');
            if (inputEl) inputEl.focus();
        }, 0);
    };

    // Switch back to conversations search mode
    const switchToConversationsSearch = () => {
        setSearchMode('conversations');
        setSearchResults([]);
        setSearchingPeople(false);
    };

    // Search for people in the database
    const searchPeople = async (query) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchingPeople(true);

        try {
            // Make the API call and set results
            const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/search?q=${query}&exclude=${currentUserId}`);
            
            // Log results for debugging
            console.log("Search results:", result.data.data);
            
            // Set search results only if we're still in people search mode
            if (searchMode === 'people') {
                setSearchResults(result.data.data || []);
            }
            
            setSearchingPeople(false);
        } catch (error) {
            console.error('Error searching for people:', error);
            setSearchingPeople(false);
            setSearchResults([]); // Ensure empty array on error
        }
    };

    // Search for people when Enter is pressed
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchMode === 'people') {
            searchPeople(searchQuery);
        }
    };

    return (
        <aside className="flex flex-col w-1/4 h-[calc(100dvh-5rem)] border-r-2 border-r-(--border-lines)">
            <section className="w-full min-h-16 flex justify-center items-center border-b-2 border-b-(--border-lines)" >
                <div className="flex justify-center items-center w-[calc(3.5/4*100%)] h-10 rounded-xl border-2 border-(--border-lines) bg-(--input-color) relative" >
                    {searchMode === 'people' && (
                        <button
                            onClick={switchToConversationsSearch}
                            className="flex items-center justify-center mx-2"
                        >
                            <HiArrowLeft className="size-5 text-(--search-icon)" />
                        </button>
                    )}
                    <HiMagnifyingGlass className="size-6 mx-2 text-(--search-icon)" />
                    <input
                        className="w-full h-full outline-0 bg-transparent placeholder:text-(--search-icon)/50"
                        type="text"
                        placeholder={searchMode === 'conversations' ? "Search conversations" : "Search for people"}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            handleSearchKeyDown(e);
                            handleSearchSubmit(e);
                        }}
                    />
                    {searchQuery && (
                        <button
                            className="absolute right-2 text-xs text-(--secondary-text) hover:text-(--primary-text)"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </section>
            <CustomScrollbar>
                {searchMode === 'conversations' ? (
                    // CONVERSATIONS MODE
                    !conversationLoading ? (
                        <>
                            {searchQuery && (
                                <div className="px-4 py-3 border-b-2 border-b-(--border-lines) hover:bg-(--hover-bg) transition-colors">
                                    <button
                                        onClick={switchToPeopleSearch}
                                        className="w-full flex items-center justify-between text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center p-2 rounded-full bg-(--input-color)">
                                                <RiUserSearchLine className="size-5 text-(--search-icon)" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-(--primary-text)">
                                                    Looking for someone new?
                                                </span>
                                                <span className="text-xs text-(--secondary-text)">
                                                    Search for "{searchQuery}" among all users
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-(--send-bubble-bg)">
                                            Search
                                        </span>
                                    </button>
                                </div>
                            )}

                            {displayConversations.length > 0 ? (
                                <div className="flex flex-col w-full">
                                    {displayConversations.map((conv, idx) => (
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
                                    {searchQuery ? (
                                        // Show "No results" when searching with no matches
                                        <>
                                            <div className="relative mb-6">
                                                <HiMagnifyingGlass className="size-16 text-(--secondary-text)" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-(--primary-text) mb-2">
                                                No matches found
                                            </h3>
                                            <p className="text-sm text-(--secondary-text) mb-2">
                                                No conversations match your search
                                            </p>
                                            <button
                                                className="text-sm text-(--send-bubble-bg) hover:underline mt-2 mb-4"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                Clear search
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-6 py-2 rounded-full border border-(--send-bubble-bg) text-(--send-bubble-bg) hover:bg-(--send-bubble-bg) hover:text-white transition-colors"
                                                onClick={switchToPeopleSearch}
                                            >
                                                <RiUserSearchLine className="size-5" />
                                                <span>Search for new people</span>
                                            </button>
                                        </>
                                    ) : (
                                        // Show empty state when no conversations exist
                                        <>
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
                                            <button
                                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-(--send-bubble-bg) text-white hover:opacity-90 transition-opacity"
                                                onClick={switchToPeopleSearch}
                                            >
                                                <RiUserAddLine className="size-5" />
                                                <span>Find People</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40">
                            <RiLoader4Line className="size-8 text-(--secondary-text) animate-spin" />
                            <span className="text-sm text-(--secondary-text) mt-2">Loading conversations...</span>
                        </div>
                    )
                ) : (
                    // PEOPLE SEARCH MODE
                    <div>
                        {searchingPeople ? (
                            <div className="flex flex-col items-center justify-center h-40">
                                <RiLoader4Line className="size-8 text-(--secondary-text) animate-spin" />
                                <span className="text-sm text-(--secondary-text) mt-2">Searching for people...</span>
                            </div>
                        ) : searchQuery.length < 2 ? (
                            <div className="flex flex-col items-center justify-center h-[calc(100dvh-13rem)] text-center px-6">
                                <div className="relative mb-6">
                                    <RiUserSearchLine className="size-16 text-(--secondary-text)" />
                                </div>
                                <h3 className="text-lg font-semibold text-(--primary-text) mb-2">
                                    Search for people
                                </h3>
                                <p className="text-sm text-(--secondary-text) mb-2">
                                    Type at least 2 characters to search
                                </p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[calc(100dvh-13rem)] text-center px-6">
                                <div className="relative mb-6">
                                    <HiMagnifyingGlass className="size-16 text-(--secondary-text)" />
                                </div>
                                <h3 className="text-lg font-semibold text-(--primary-text) mb-2">
                                    No users found
                                </h3>
                                <p className="text-sm text-(--secondary-text) mb-2">
                                    No users match your search "{searchQuery}"
                                </p>
                                <button
                                    className="flex items-center gap-2 px-4 py-1 rounded-full text-(--send-bubble-bg) border border-(--send-bubble-bg) hover:bg-(--send-bubble-bg) hover:text-white transition-colors mt-4"
                                    onClick={switchToConversationsSearch}
                                >
                                    <HiArrowLeft className="size-4" />
                                    <span>Back to conversations</span>
                                </button>
                            </div>
                        ) : (
                            // Display search results here
                            <div className="flex flex-col w-full">
                                {searchResults.map((user, idx) => {
                                    const toUserId = user.clerkId;
                                    const cId = generateConversationId(currentUserId, toUserId);
                                    const convData = {
                                        conversationId: cId,
                                        friend: user,
                                        lastMessage: "",
                                        unreadCount: 0
                                    };
                                    return (
                                        <Conversation
                                            key={convData.conversationId}
                                            conversationData={convData}
                                            isFirst={idx === 0}
                                            isActive={false}
                                            onSelect={handleConversationSelect}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </CustomScrollbar>
        </aside>
    );
};

export default Sidebar;