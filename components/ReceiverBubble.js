import React from 'react'
import { format } from 'date-fns';

const ReceiverBubble = ({ chat, isConsecutive, showTime }) => {
    const formattedTime = chat?.createdAt 
        ? format(new Date(chat.createdAt), 'hh:mm a')
        : '';

    return (
        <div className={`flex flex-col items-start ${isConsecutive ? 'mb-1' : 'mb-4'}`}>
            <div className="self-start px-4 py-2 max-w-[70%] bg-(--receive-bubble-bg) text-(--receive-bubble-text) rounded-2xl rounded-bl-none border border-(--receive-bubble-outline)">
                <p className="break-words whitespace-pre-wrap">{chat?.content}</p>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[10px] border-t-(--receive-bubble-bg) border-r-[10px] border-r-transparent"></div>
            </div>
            {showTime && (
                <div className="mt-1 text-[10px] text-gray-500">
                    {formattedTime}
                </div>
            )}
        </div>
    );
}

export default ReceiverBubble