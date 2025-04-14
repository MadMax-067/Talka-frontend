import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import localFont from 'next/font/local'

const SfProDisplayRegular = localFont({ src: '../fonts/SF-Pro-Display-Regular.otf' })


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Talka – Real Talk, Reimagined.",
  description: "Say It. Share It. Talka It.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${SfProDisplayRegular.className} antialiased`}
        >
          <SocketProvider>
            <Navbar />
            <main className="flex">
              <Sidebar />
              {children}
            </main>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
