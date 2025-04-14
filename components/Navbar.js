import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { RiChatSmile2Line } from 'react-icons/ri'

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 gap-4 h-20 border-b-2 border-b-(--border-lines)">
            <span className="flex items-center text-3xl font-semibold tracking-wider" >
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-(--primary-text) opacity-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <RiChatSmile2Line className="size-10 text-(--secondary-text) group-hover:text-(--primary-text) transition-colors" />
                </div>
                Talka
            </span>
            <SignedOut>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <SignUpButton mode="modal">
                        <button className="px-8 py-3 rounded-full bg-(--send-bubble-bg) text-white font-medium hover:opacity-90 transition-opacity">
                            Get Started
                        </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <button className="px-8 py-3 rounded-full border-2 border-(--border-lines) text-(--primary-text) font-medium hover:bg-(--hover-bg) transition-colors">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </nav>
    )
}

export default Navbar