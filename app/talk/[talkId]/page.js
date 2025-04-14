import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server';
import ChatSection from '@/components/ChatSection';
import Sidebar from '@/components/Sidebar';
import React from 'react'

const page = async ({ params }) => {
    const user = await currentUser();

    if (!user) {
        redirect('/')
    }
    
    const { talkId } = await params;
    
    return (
        <>
            <Sidebar />
            <ChatSection />
        </>
    )
}

export default page