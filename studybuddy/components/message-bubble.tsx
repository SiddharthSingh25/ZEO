"use client"

import { VolumeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageProps {
  message: {
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
  playAudio: () => void
}

export default function MessageBubble({ message, playAudio }: MessageProps) {
  const isBot = message.sender === "bot"

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isBot ? "bg-white border border-purple-100 text-gray-800" : "bg-purple-600 text-white"
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p>{message.text}</p>

            {isBot && message.processedData && (
              <div className="mt-2 pt-2 border-t border-purple-100 text-xs text-gray-500">
                <details>
                  <summary className="cursor-pointer font-medium">NLP Analysis</summary>
                  <div className="mt-1 space-y-1">
                    <p>
                      <span className="font-medium">Tokenization:</span>{" "}
                      {message.processedData.tokens.slice(0, 5).join(", ")}
                      {message.processedData.tokens.length > 5 ? "..." : ""}
                    </p>
                    <p>
                      <span className="font-medium">Without Stopwords:</span>{" "}
                      {message.processedData.withoutStopwords.slice(0, 5).join(", ")}
                      {message.processedData.withoutStopwords.length > 5 ? "..." : ""}
                    </p>
                    <p>
                      <span className="font-medium">Stemmed:</span>{" "}
                      {message.processedData.stemmed.slice(0, 5).join(", ")}
                      {message.processedData.stemmed.length > 5 ? "..." : ""}
                    </p>
                    <p>
                      <span className="font-medium">Entities:</span>{" "}
                      {message.processedData.entities.length > 0
                        ? message.processedData.entities
                            .slice(0, 3)
                            .map((e: any) => `${e.text} (${e.type})`)
                            .join(", ")
                        : "None detected"}
                    </p>
                  </div>
                </details>
              </div>
            )}
          </div>

          {isBot && (
            <Button
              variant="ghost"
              size="icon"
              onClick={playAudio}
              className="h-6 w-6 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            >
              <VolumeIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
