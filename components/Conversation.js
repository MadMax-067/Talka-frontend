import React from 'react'
import Image from 'next/image'

const Conversation = ({ isFirst, conversationData }) => {
  return (
    <div className={`flex justify-between mx-6 ${isFirst ? 'border-0' : 'border-t-2'} border-t-(--border-lines) min-h-[4.5rem]`} >
      <div className="flex items-center" >
        <Image className="rounded-full object-cover w-10 h-10" src={conversationData?.avatar} alt={conversationData?.fullName} width={64} height={64} />
        <div className="flex flex-col ml-4 gap-0.5">
          <span className="text-lg text-(--primary-text)" >{conversationData ? conversationData?.name : "Jhon Doe"}</span>
          <span className="text-sm font-light text-(--secondary-text)" >{conversationData ? conversationData?.lastMessage : "Good Morning"}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 mt-4">
        <span className="text-xs text-(--secondary-text)" >{conversationData ? conversationData?.lastMessageTime : "10:32 AM"}</span>
        {conversationData?.unreadCount > 0 && (
          <span className="flex justify-center items-center text-center bg-green-600 text-white rounded-full px-2 py-1 text-xs" >{conversationData?.unreadCount}</span>
        )}
      </div>
    </div>
  )
}

export default Conversation