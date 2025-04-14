import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import {RiChatSmile2Line, RiChat3Line, RiShieldLine, RiSparklingLine } from 'react-icons/ri'
import ChatPlaceholder from "@/components/ChatPlaceholder";

export default function Home() {
  return (
    <>
      <SignedIn>
        <ChatPlaceholder />
      </SignedIn>
      <SignedOut>
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-(--bg) to-(--input-bg)">

          <div className="text-center space-y-6 max-w-2xl mx-auto">

            <div className="relative group cursor-pointer mb-8">
              <div className="absolute inset-0 bg-(--primary-text) opacity-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              <RiChatSmile2Line className="size-20 text-(--primary-text) mx-auto transform group-hover:rotate-12 transition-transform" />
            </div>

            <h1 className="text-4xl font-bold text-(--primary-text) mb-4">
              Welcome to <span className="text-gradient">Talka</span>
            </h1>
            
            <p className="text-lg text-(--secondary-text) mb-8">
              Connect, chat, and collaborate in real-time with a modern messaging experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-(--card-bg) border border-(--border-lines) hover:border-(--hover-border) transition-all hover:-translate-y-1"
                >
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-(--primary-text) mt-4 text-center">{feature.title}</h3>
                  <p className="text-sm text-(--secondary-text) mt-2 text-center">{feature.description}</p>
                </div>
              ))}
            </div>

            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <SignUpButton mode="modal">
                <button className="px-8 py-3 rounded-full bg-(--send-bubble-bg) text-white font-medium hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-8 py-3 rounded-full border-2 border-(--border-lines) text-(--primary-text) font-medium hover:bg-(--hover-bg) transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </main>
      </SignedOut>
    </>
  );
}

// Features data
const features = [
  {
    icon: <RiChat3Line className="size-8 text-(--primary-text)" />,
    title: "Real-time Chat",
    description: "Instant messaging with seamless real-time updates and notifications."
  },
  {
    icon: <RiShieldLine className="size-8 text-(--primary-text)" />,
    title: "Secure",
    description: "End-to-end encryption keeps your conversations private and secure."
  },
  {
    icon: <RiSparklingLine className="size-8 text-(--primary-text)" />,
    title: "Modern UI",
    description: "Clean, minimal interface designed for the best user experience."
  }
];
