"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-interface"

export default function ChatPage() {
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = sessionStorage.getItem("username")
    if (!storedUsername) {
      router.push("/")
      return
    }
    setUsername(storedUsername)
  }, [router])

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-purple-100 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">StudyBuddy</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Welcome, {username}</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("username")
                router.push("/")
              }}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 max-w-5xl w-full mx-auto p-4">
        <ChatInterface username={username} />
      </div>
    </main>
  )
}
