"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { Send, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "ai"
  text: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "こんにちは！取引先に関する質問があればお気軽にどうぞ。" },
  ])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || loading) return

    // ユーザーメッセージを追加
    setMessages([...messages, { role: "user", text }])
    setLoading(true)
    setText("")

    try {
      // APIリクエスト
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ text }),
      })

      const { answer } = await res.json()

      // AIの応答を追加
      setMessages((m) => [...m, { role: "ai", text: answer }])
    } catch (error) {
      console.error("Error fetching response:", error)
      setMessages((m) => [...m, { role: "ai", text: "申し訳ありません。エラーが発生しました。" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <CompanyContextBanner />
      <PageHeader title="AIチャットボット" />

      <Card className="p-4 space-y-4">
        <div id="messages" className="space-y-4 overflow-y-auto h-[60vh] p-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 max-w-[80%] rounded-lg p-3",
                message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {message.role === "ai" && <Bot className="h-5 w-5 mt-1 flex-shrink-0" />}
              <div className="break-words">{message.text}</div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2 max-w-[80%] rounded-lg p-3 bg-muted">
              <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="質問を入力..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" disabled={loading || !text.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">送信</span>
          </Button>
        </form>
      </Card>
    </div>
  )
}
