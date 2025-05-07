"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function CrowdPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "アクメ株式会社"
  const [text, setText] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 初期データ
  const initialPosts = [
    {
      id: 901,
      user: "hana",
      cred: 0.92,
      text: `${companyName} がAI研究所新設検討`,
      ts: "2時間前",
      upvotes: 12,
      avatarUrl: "/letter-h-typography.png",
    },
    {
      id: 902,
      user: "toru",
      cred: 0.61,
      text: "NECがCEO交代の噂あり",
      ts: "5時間前",
      upvotes: 5,
      avatarUrl: "/letter-t-typography.png",
    },
    {
      id: 903,
      user: "yuki",
      cred: 0.85,
      text: "富士通が新規特許出願を確認",
      ts: "6時間前",
      upvotes: 8,
      avatarUrl: "/abstract-letter-y.png",
    },
    {
      id: 904,
      user: "ken",
      cred: 0.73,
      text: "NTTデータが欧州市場への進出計画",
      ts: "8時間前",
      upvotes: 7,
      avatarUrl: "/letter-k-typography.png",
    },
    {
      id: 905,
      user: "mari",
      cred: 0.45,
      text: "研究開発費の増額検討中",
      ts: "10時間前",
      upvotes: 3,
      avatarUrl: "/letter-m-typography.png",
    },
  ]

  // 追加データ
  const additionalPosts = [
    {
      id: 906,
      user: "sato",
      cred: 0.88,
      text: "新規サプライヤーとの契約交渉中",
      ts: "12時間前",
      upvotes: 9,
      avatarUrl: "/abstract-letter-s.png",
    },
    {
      id: 907,
      user: "tanaka",
      cred: 0.52,
      text: "四半期決算は予想を上回る見込み",
      ts: "14時間前",
      upvotes: 4,
      avatarUrl: "/placeholder.svg?key=1qu5k",
    },
    {
      id: 908,
      user: "yamada",
      cred: 0.79,
      text: "新製品発表イベントを計画中",
      ts: "16時間前",
      upvotes: 11,
      avatarUrl: "/placeholder.svg?key=w76vq",
    },
    {
      id: 909,
      user: "suzuki",
      cred: 0.67,
      text: "主要顧客との契約更新",
      ts: "18時間前",
      upvotes: 6,
      avatarUrl: "/placeholder.svg?key=gylrq",
    },
    {
      id: 910,
      user: "nakamura",
      cred: 0.91,
      text: "新技術の特許取得に成功",
      ts: "20時間前",
      upvotes: 15,
      avatarUrl: "/placeholder.svg?key=bqhto",
    },
  ]

  useEffect(() => {
    setPosts(initialPosts)
  }, [companyName])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && posts.length < 10) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [posts, loading])

  const loadMorePosts = () => {
    setLoading(true)
    // 遅延を模倣
    setTimeout(() => {
      setPosts((prev) => [...prev, ...additionalPosts])
      setLoading(false)
    }, 1500)
  }

  const handlePost = () => {
    if (!text.trim()) return

    const newPost = {
      id: Date.now(),
      user: "me",
      cred: 0.75,
      text: text,
      ts: "たった今",
      upvotes: 0,
      avatarUrl: "/placeholder.svg?key=q26gm",
    }

    setPosts([newPost, ...posts])
    setText("")
  }

  const getCredibilityBadge = (cred: number) => {
    if (cred >= 0.8) {
      return <Badge className="bg-green-500">高信頼度 {(cred * 100).toFixed(0)}</Badge>
    } else if (cred >= 0.6) {
      return <Badge variant="default">中信頼度 {(cred * 100).toFixed(0)}</Badge>
    } else {
      return <Badge variant="destructive">低信頼度 {(cred * 100).toFixed(0)}</Badge>
    }
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title="Crowd フィード" />

      <div className="mb-6">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="pt-6">
            <Textarea
              placeholder="情報や洞察を共有..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="resize-none mb-3"
            />
            <div className="flex justify-end">
              <Button onClick={handlePost}>投稿</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={post.avatarUrl || "/placeholder.svg"} alt={post.user} />
                  <AvatarFallback>{post.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{post.user}</span>
                      {getCredibilityBadge(post.cred)}
                    </div>
                    <span className="text-sm text-muted-foreground">{post.ts}</span>
                  </div>
                  <p className="mb-3">{post.text}</p>
                  <div className="flex items-center text-muted-foreground">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.upvotes}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {loading && <p className="text-muted-foreground">読み込み中...</p>}
        </div>
      </div>
    </div>
  )
}
