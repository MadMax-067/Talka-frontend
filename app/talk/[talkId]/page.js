import ChatSection from '@/components/ChatSection';
import React from 'react'

const page = async ({ params }) => {
    const { talkId } = await params;
    return (
        <>
            <ChatSection />
        </>
    )
}

export default page