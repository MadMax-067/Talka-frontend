import React from 'react'

const ReceiverBubble = () => {
    return (
        <div className="flex justify-start mb-2">
            <div className="relative bg-(--receive-bubble-bg) text-(--receive-bubble-text) px-4 py-2 rounded-2xl rounded-bl-none max-w-[70%] border border-(--receive-bubble-outline)">
                I'm good, thanks!
                <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[10px] border-t-(--receive-bubble-bg) border-r-[10px] border-r-transparent"></div>
                <div className="absolute bottom-[-18px] left-1 text-[10px] text-gray-500">
                    12:31 PM
                </div>
            </div>
        </div>
    )
}

export default ReceiverBubble