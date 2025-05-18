import React, { useEffect, useState } from 'react'
import { IoCheckmarkDone } from "react-icons/io5";
import { format } from 'date-fns';
import { motion } from "motion/react"

const SenderBubble = ({ chat, isConsecutive, showTime }) => {
    const [wasRead, setWasRead] = useState(false);
    const formattedTime = chat?.createdAt 
        ? format(new Date(chat.createdAt), 'hh:mm a')
        : '';
    
    // Track when message changes from unread to read
    useEffect(() => {
        if (chat?.read && !wasRead) {
            setWasRead(true);
        }
    }, [chat?.read, wasRead]);

    return (
        <div className={`flex flex-col items-end ${isConsecutive ? 'mb-1' : 'mb-4'}`}>
            <motion.div 
                className="self-end px-4 py-2 max-w-[70%] bg-(--send-bubble-bg) text-(--send-bubble-text) rounded-2xl rounded-br-none border border-(--send-bubble-outline) relative"
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    duration: 0.3
                }}
            >
                <p className="break-words whitespace-pre-wrap">{chat?.content}</p>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[10px] border-t-(--send-bubble-bg) border-l-[10px] border-l-transparent"></div>
            </motion.div>
            
            {showTime && (
                <motion.div 
                    className="flex items-center gap-1 mt-1 text-[10px] text-gray-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <span>{formattedTime}</span>
                    <motion.div
                        initial={false}
                        animate={{
                            // All three animations happen in sequence
                            color: chat?.read ? "#3b82f6" : "#9ca3af", // Blue or gray
                            scale: wasRead ? [1, 1.5, 1] : 1,
                            rotate: wasRead ? [0, 180, 360] : 0
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                    >
                        <IoCheckmarkDone />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default SenderBubble