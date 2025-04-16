import React from 'react'
import { IoCheckmarkDone } from "react-icons/io5";
import { format } from 'date-fns';

const SenderBubble = ({ chat, isConsecutive, showTime }) => {
    const formattedTime = chat?.createdAt 
        ? format(new Date(chat.createdAt), 'hh:mm a')
        : '';

    return (
        <div className={`flex flex-col items-end ${isConsecutive ? 'mb-1' : 'mb-4'}`}>
            <div className="self-end px-4 py-2 max-w-[70%] bg-(--send-bubble-bg) text-(--send-bubble-text) rounded-2xl rounded-br-none border border-(--send-bubble-outline)">
                <p className="break-words whitespace-pre-wrap">{chat?.content}</p>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[10px] border-t-(--send-bubble-bg) border-l-[10px] border-l-transparent"></div>
            </div>
            {showTime && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                    <span>{formattedTime}</span>
                    <IoCheckmarkDone className={`${chat?.read ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
            )}
        </div>
    );
};

export default SenderBubble