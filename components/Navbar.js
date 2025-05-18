"use client"
import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { useSocket } from "@/context/SocketContext"
import { RiChatSmile2Line } from 'react-icons/ri'

const Navbar = () => {
    const { socket } = useSocket?.() || {};

    const handleSignOut = () => {
        try {
            if (socket) {
                socket.disconnect();
            }
            
            return true;
        } catch (error) {
            console.error('Error during signout cleanup:', error);
            return true;
        }
    };

    return (
        <nav className="flex justify-between items-center px-3 sm:px-6 py-4 gap-2 sm:gap-4 h-20 border-b-2 border-b-(--border-lines)">
            <span className="flex items-center text-2xl sm:text-3xl font-semibold tracking-wider" >
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-(--primary-text) opacity-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <RiChatSmile2Line className="size-8 sm:size-10 text-(--secondary-text) group-hover:text-(--primary-text) transition-colors" />
                </div>
                Talka
            </span>
            <SignedOut>
                <div className="flex sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                    <SignUpButton mode="modal">
                        <button className="w-full px-3 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full bg-(--send-bubble-bg) text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                            Get Started
                        </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <button className="w-full px-3 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full border-2 border-(--border-lines) text-(--primary-text) font-medium hover:bg-(--hover-bg) transition-colors whitespace-nowrap">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>
            <SignedIn>
                <UserButton 
                    signInUrl="/"
                    afterSignOutUrl="/"
                    beforeSignOutAll={handleSignOut}
                />
            </SignedIn>
        </nav>
    )
}

export default Navbar