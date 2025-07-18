"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSocket } from "@/context/SocketContext";


export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const { isMobile,selectedConversation } = useSocket();
  // const isChatPage = pathname?.startsWith('/talk/');
  const hideNavbar = isMobile && selectedConversation;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex justify-center">
        {children}
      </main>
    </>
  );
}
