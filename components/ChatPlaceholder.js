import React from 'react'
import { RiChatSmile2Line } from 'react-icons/ri'

const ChatPlaceholder = () => {
    return (
        <section className="w-3/4 max-h-[calc(100dvh-5rem)] flex flex-col">
            <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
                
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-(--primary-text) opacity-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <RiChatSmile2Line className="size-24 text-(--secondary-text) group-hover:text-(--primary-text) transition-colors" />
                </div>

                
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold text-(--primary-text)">
                        Welcome to Talka
                    </h1>
                    <p className="text-(--secondary-text) max-w-md">
                        Select a conversation to start messaging or discover new connections to expand your network.
                    </p>
                </div>

                
                <div className="flex gap-2 mt-4">
                    <span className="h-2 w-2 rounded-full bg-(--primary-text) opacity-20 animate-pulse" style={{ animationDelay: '0s' }} />
                    <span className="h-2 w-2 rounded-full bg-(--primary-text) opacity-20 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-(--primary-text) opacity-20 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </section>
    )
}

export default ChatPlaceholder