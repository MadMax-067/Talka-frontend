"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

const Conversation = ({ isFirst, conversationData, isActive, onSelect }) => {
  const router = useRouter();
  
  // Format the timestamp to hh:mm AM/PM
  const formattedTime = conversationData?.lastUpdated 
    ? format(new Date(conversationData.lastUpdated), 'hh:mm a')
    : '';

  // Format the name to limit length to 12 characters
  const formatName = (name) => {
    if (!name) return '';
    return name.length > 12 ? `${name.substring(0, 12)}...` : name;
  };

  const handleClick = () => {
    onSelect(conversationData);
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        flex justify-between px-6 py-3 
        ${isFirst ? 'border-0' : 'border-t-2'} 
        border-t-(--border-lines) 
        min-h-[4.5rem]
        cursor-pointer
        hover:bg-(--hover-bg)
        transition-colors
        ${isActive ? 'bg-(--hover-bg)' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image 
            className="rounded-full object-cover w-12 h-12" 
            src={conversationData?.friend?.avatar} 
            alt={conversationData?.friend?.fullName} 
            width={64} 
            height={64} 
          />
          {conversationData?.friend?.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-medium text-(--primary-text)" title={conversationData?.friend?.fullName}>
            {formatName(conversationData?.friend?.fullName)}
          </span>
          <span className="text-sm text-(--secondary-text) line-clamp-1 max-w-[200px]">
            {conversationData?.lastMessage}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 mt-1">
        <span className="text-xs text-(--secondary-text)">
          {formattedTime}
        </span>
        {conversationData?.unreadCount > 0 && (
          <span className="flex justify-center items-center text-center bg-(--send-bubble-bg) text-white rounded-full min-w-[20px] h-5 text-xs px-1.5">
            {conversationData?.unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default Conversation