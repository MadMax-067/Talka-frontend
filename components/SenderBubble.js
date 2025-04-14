import React from 'react'
import { IoCheckmarkDone } from "react-icons/io5";

const SenderBubble = () => {
    return (
        <div className="flex justify-end mb-2">
            <div className="relative bg-(--send-bubble-bg) text-(--send-bubble-text) px-4 py-2 rounded-2xl rounded-br-none max-w-[70%] border border-(--send-bubble-outline)">
                Hii How are you?
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[10px] border-t-(--send-bubble-bg) border-l-[10px] border-l-transparent"></div>
                <div className="flex items-center gap-1 absolute bottom-[-18px] right-1 text-[10px] text-gray-500">
                    <span>12:30 PM</span>
                    <IoCheckmarkDone className="text-blue-500" />
                </div>
            </div>
        </div>
    )
}

export default SenderBubble