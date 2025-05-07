"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Bell,
  Building,
  FileText,
  Home,
  Lightbulb,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Bot,
  Network,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { tradingPartners } from "@/lib/sampleData"
import { Suspense } from "react"

// routes 配列を更新して、ネットワーク図へのリンクを追加します
const routes = [
  {
    label: "ホーム",
    icon: Home,
    href: "/portal",
    color: "text-sky-500",
  },
  {
    label: "アカウント",
    icon: Building,
    href: "/account/hitachi",
    color: "text-violet-500",
  },
  {
    label: "商談検索",
    icon: Search,
    href: "/deals",
    color: "text-indigo-500",
  },
  {
    label: "ブリーフ",
    icon: FileText,
    href: "/briefs",
    color: "text-pink-700",
  },
  {
    label: "関係者ネットワーク",
    icon: Network,
    href: "/network/hitachi",
    color: "text-teal-500",
  },
  {
    label: "戦略ボード",
    icon: BarChart3,
    href: "/strategy/1",
    color: "text-orange-700",
  },
  {
    label: "オポチュニティ",
    icon: Lightbulb,
    href: "/discover",
    color: "text-yellow-500",
  },
  {
    label: "Crowdフィード",
    icon: MessageSquare,
    href: "/crowd",
    color: "text-green-700",
  },
  {
    label: "リスクレーダー",
    icon: Shield,
    href: "/risk",
    color: "text-red-700",
  },
  {
    label: "AIチャット",
    icon: Bot,
    href: "/chat",
    color: "text-blue-500",
  },
  {
    label: "設定",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
]

// 検索フォームのスキーマ
const formSchema = z.object({
  companyName: z.string().min(1, {
    message: "企業名を入力してください",
  }),
})

// 内部コンポーネントを作成して、useSearchParamsを使用する部分を分離
function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCompany = searchParams.get("companyName") || "日立製作所"
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 企業サジェスト
  const companySuggestions = tradingPartners.map((tp) => tp.name)

  // フォーム設定
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: currentCompany,
    },
  })

  // 検索処理
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSearching(true)
    setShowSuggestions(false)

    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString())

    // 企業名パラメータを更新
    params.set("companyName", values.companyName)

    // 現在のパスを維持しながらパラメータを更新
    router.push(`${pathname}?${params.toString()}`)

    setTimeout(() => {
      setIsSearching(false)
    }, 500)
  }

  // サジェスト選択処理
  const selectSuggestion = (company: string) => {
    form.setValue("companyName", company)
    setShowSuggestions(false)

    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString())

    // 企業名パラメータを更新
    params.set("companyName", company)

    // 現在のパスを維持しながらパラメータを更新
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col h-full space-y-4 bg-[#002B5B] text-white w-64 p-4">
      <div className="px-3 py-2 flex items-center gap-2">
        <Bell className="h-8 w-8" />
        <h1 className="text-2xl font-bold">GRIP</h1>
      </div>

      {/* 企業検索フォーム */}
      <div className="px-3 py-2 bg-white/10 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="text-sm font-medium mb-1">企業検索</div>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormControl>
                      <Input
                        placeholder="企業名を入力..."
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                        {...field}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                    </FormControl>
                    {showSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                        {companySuggestions.map((company) => (
                          <div
                            key={company}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => selectSuggestion(company)}
                          >
                            {company}
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" variant="secondary" disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
        {currentCompany && (
          <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded flex items-center justify-between">
            <span>現在: {currentCompany}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`${route.href}?companyName=${encodeURIComponent(currentCompany)}`}
            className={cn(
              "flex items-center p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
              pathname === route.href ? "bg-white/10 text-white" : "text-zinc-300",
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// フォールバックUI
const SidebarFallback = () => (
  <div className="flex flex-col h-full space-y-4 bg-[#002B5B] text-white w-64 p-4">
    <div className="px-3 py-2 flex items-center gap-2">
      <Bell className="h-8 w-8" />
      <h1 className="text-2xl font-bold">GRIP</h1>
    </div>
    <div className="px-3 py-2 bg-white/10 rounded-lg h-24"></div>
    <div className="space-y-1">
      {routes.map((route) => (
        <div
          key={route.href}
          className="flex items-center p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition text-zinc-300"
        >
          <div className="flex items-center flex-1">
            <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
            {route.label}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// メインコンポーネントはSuspenseでラップ
export default function Sidebar() {
  return (
    <Suspense fallback={<SidebarFallback />}>
      <SidebarContent />
    </Suspense>
  )
}
