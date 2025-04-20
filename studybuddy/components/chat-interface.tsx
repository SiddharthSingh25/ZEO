"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Howl } from "howler"
import { SendIcon } from "lucide-react"
import MessageBubble from "@/components/message-bubble"
import { processText } from "@/lib/simple-nlp" // Import our simplified NLP implementation

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  processedData?: {
    tokens: string[]
    withoutStopwords: string[]
    stemmed: string[]
    entities: any[]
  }
}

export default function ChatInterface({ username }: { username: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hi ${username}! I'm your StudyBuddy. Ask me anything about your studies!`,
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Process the user's message with our simplified NLP
      const processedData = await processText(input)

      // Generate a response based on the processed data
      const botResponse = generateResponse(input, processedData)

      // Add bot message with processed data
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        processedData,
      }

      setMessages((prev) => [...prev, botMessage])

      // Play the text-to-speech audio
      playTextToSpeech(botResponse)
    } catch (error) {
      console.error("Error processing message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I had trouble processing that. Could you try again?",
          sender: "bot",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const playTextToSpeech = (text: string) => {
    try {
      // Encode the text for URL
      const encodedText = encodeURIComponent(text)
      const audioUrl = `https://api.vo.dev/tts?text=${encodedText}`

      // Use Howler to play the audio
      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        format: ["mp3"],
      })

      sound.play()
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  const generateResponse = (input: string, processedData: any): string => {
    // Simple response generation based on keywords
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello there! How can I help with your studies today?"
    }

    if (lowerInput.includes("math") || lowerInput.includes("mathematics")) {
      return "I can help with math! What specific topic are you studying?"
    }

    if (lowerInput.includes("science")) {
      return "Science is fascinating! Are you studying biology, chemistry, physics, or another branch?"
    }

    if (lowerInput.includes("history")) {
      return "History is full of interesting stories! Which period or event are you learning about?"
    }

    if (lowerInput.includes("english") || lowerInput.includes("literature")) {
      return "I love literature! Are you reading a specific book or studying grammar?"
    }

    if (lowerInput.includes("help") || lowerInput.includes("stuck")) {
      return "I'm here to help! Could you provide more details about what you're struggling with?"
    }

    // Default response that mentions the NLP processing
    return `I noticed you mentioned ${processedData.entities.length > 0 ? processedData.entities.map((e: any) => e.text).join(", ") : "some interesting topics"}. Could you elaborate more on what you'd like to learn?`
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 overflow-hidden flex flex-col bg-white border-purple-100">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} playAudio={() => playTextToSpeech(message.text)} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-purple-100 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask your study question..."
              disabled={isProcessing}
              className="border-purple-200 focus:border-purple-400"
            />
            <Button onClick={handleSendMessage} disabled={isProcessing} className="bg-purple-600 hover:bg-purple-700">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
