import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server';
import ChatPlaceholder from '@/components/ChatPlaceholder'
import Sidebar from '@/components/Sidebar'

async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/')
    }

    return (
        <>
            <Sidebar />
            <ChatPlaceholder />
        </>
    )
}

export default Page