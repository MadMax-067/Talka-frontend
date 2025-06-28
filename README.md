<div align="center">
  <img src="public/talka.svg" alt="Talka Logo" width="200"/>

  # Talka
  ### A Modern Real-Time Messaging Platform

  ![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
  ![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
</div>

## 💬 About Talka

Talka is a modern, real-time messaging platform that brings people together through seamless communication. Built with cutting-edge web technologies, it delivers a fast, secure, and intuitive chat experience that works beautifully on any device.

## ✨ Features

- 💬 **Real-Time Messaging**
  - Instant message delivery with Socket.io
  - Live typing indicators
  - Message status updates
  - Real-time notifications

- 🔐 **Secure Authentication**
  - Powered by Clerk for robust user management
  - Secure session handling
  - Social login options
  - Protected routes

- 📱 **Modern UI/UX**
  - Responsive design for all devices
  - Custom scrollbars and animations
  - Clean, minimal interface
  - Dark theme support

- 🚀 **Performance Optimized**
  - Server-side rendering with Next.js
  - Optimized font loading
  - Efficient real-time updates
  - Mobile-first responsive design

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3, React 19, TailwindCSS 4.0
- **Real-time**: Socket.io Client 4.8
- **Authentication**: Clerk
- **Icons**: React Icons, FontAwesome
- **Animations**: Motion
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd Talka-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Clerk API keys and other configuration.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Talka-frontend/
├── app/                    # Next.js app directory
│   ├── talk/              # Chat pages
│   └── layout.js          # Root layout
├── components/            # Reusable UI components
│   ├── ChatSection.js     # Main chat interface
│   ├── Conversation.js    # Conversation list
│   └── Sidebar.js         # Navigation sidebar
├── context/               # React context providers
│   └── SocketContext.js   # Socket.io context
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── constants/             # App constants
```

## 🌟 Key Features Deep Dive

### Real-Time Communication
Talka uses Socket.io for real-time bidirectional communication, ensuring messages are delivered instantly with minimal latency.

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Custom Components**: Hand-crafted UI components for the best user experience
- **Smooth Animations**: Subtle animations that enhance the interaction

### Security
- **Authentication**: Secure user authentication and session management
- **Protected Routes**: Middleware protection for authenticated areas
- **Data Validation**: Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by Manraj
</div>