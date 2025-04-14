import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 gap-4 h-20 border-b-2 border-b-(--border-lines)">
            <span className="text-3xl font-semibold tracking-wider" >Talka</span>
            <SignedOut>
                <div className="flex items-center gap-4">
                    <SignInButton />
                    <SignUpButton />
                </div>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </nav>
    )
}

export default Navbar