"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Phone, AlertTriangle, BarChart3, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { tradingPartners, opportunities, groupCompanies, pastTransactions } from "@/lib/sampleData"
import { Suspense } from "react"

// 簡易コンポーネント
const StatCard = ({ title, value, trend }: { title: string; value: number[]; trend: number }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {new Intl.NumberFormat("ja-JP", {
          style: "currency",
          currency: "JPY",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value[value.length - 1])}
      </div>
      <div className="flex items-center mt-1">
        {trend > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
        <span className="text-xs text-muted-foreground ml-1">前年比</span>
      </div>
    </CardContent>
  </Card>
)

const NewsRow = ({ source, title, url, date }: { source: string; title: string; url: string; date: string }) => (
  <div className="py-3 border-b last:border-0">
    <div className="flex justify-between items-start mb-1">
      <Badge variant="outline" className="text-xs">
        {source}
      </Badge>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
    <div className="flex justify-between items-center">
      <p className="font-medium">{title}</p>
      <Button variant="ghost" size="sm" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  </div>
)

// 財務データ棒グラフ
const FinancialBarChart = ({ data }: { data: { year: number; sales: number; op: number; net: number }[] }) => {
  // 最大値を計算して、グラフの高さを調整
  const maxValue = Math.max(...data.map((d) => d.sales))
  const scale = 300 / maxValue // 300pxを最大の高さとする

  return (
    <div className="h-[350px] w-full p-4">
      <div className="flex justify-between mb-2">
        {data.map((d, i) => (
          <div key={i} className="text-center font-medium">
            {d.year}年度
          </div>
        ))}
      </div>
      <div className="flex justify-around items-end h-[300px] border-b border-l relative">
        {/* Y軸ラベル */}
        <div className="absolute -left-2 top-0 h-full flex flex-col justify-between">
          <span className="text-xs text-muted-foreground -translate-y-1/2">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
              notation: "compact",
            }).format(maxValue)}
          </span>
          <span className="text-xs text-muted-foreground -translate-y-1/2">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
              notation: "compact",
            }).format(maxValue / 2)}
          </span>
          <span className="text-xs text-muted-foreground">0</span>
        </div>

        {data.map((d, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-blue-500"
                style={{ height: `${d.sales * scale}px` }}
                title={`売上: ${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                  notation: "compact",
                }).format(d.sales)}`}
              ></div>
              <span className="text-xs mt-1">売上</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-green-500"
                style={{ height: `${d.op * scale}px` }}
                title={`営業利益: ${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                  notation: "compact",
                }).format(d.op)}`}
              ></div>
              <span className="text-xs mt-1">営業利益</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-purple-500"
                style={{ height: `${d.net * scale}px` }}
                title={`純利益: ${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                  notation: "compact",
                }).format(d.net)}`}
              ></div>
              <span className="text-xs mt-1">純利益</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 取引データ棒グラフ
const TransactionBarChart = ({ data }: { data: { year: number; revenue: number; cost: number }[] }) => {
  // 最大値を計算して、グラフの高さを調整
  const maxValue = Math.max(...data.map((d) => d.revenue), ...data.map((d) => d.cost))
  const scale = 150 / maxValue // 150pxを最大の高さとする

  return (
    <div className="h-[350px] w-full p-4">
      <div className="flex justify-between mb-2">
        {data.map((d, i) => (
          <div key={i} className="text-center font-medium">
            {d.year}年度
          </div>
        ))}
      </div>
      <div className="flex justify-around items-center h-[300px] border-b relative">
        {/* 中央線（0） */}
        <div className="absolute left-0 right-0 h-[1px] bg-gray-300 top-1/2"></div>

        {/* Y軸ラベル */}
        <div className="absolute -left-2 top-0 h-full flex flex-col justify-between">
          <span className="text-xs text-muted-foreground -translate-y-1/2">
            {new Intl.NumberFormat("ja-JP").format(maxValue)}万円
          </span>
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground translate-y-1/2">
            -{new Intl.NumberFormat("ja-JP").format(maxValue)}万円
          </span>
        </div>

        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center h-full justify-center">
            <div
              className="w-16 bg-green-500"
              style={{ height: `${d.revenue * scale}px` }}
              title={`売上: ${d.revenue}万円`}
            ></div>
            <div className="text-xs my-1">FY{d.year}</div>
            <div
              className="w-16 bg-red-400"
              style={{ height: `${d.cost * scale}px` }}
              title={`費用: ${d.cost}万円`}
            ></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="text-sm">売上</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 mr-2"></div>
          <span className="text-sm">費用</span>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  // 取引先データの取得
  const partner = tradingPartners.find((p) => p.id === params.id) || tradingPartners[0]
  const deals = opportunities.filter((o) => o.accountId === partner.id)
  const contacts = groupCompanies.slice(0, 3).map((gc) => ({
    id: gc.id,
    name: gc.name,
    role: gc.role,
    phone: "+81-3-XXXX-XXXX",
    email: `${gc.id}@example.com`,
    avatarUrl: "/placeholder.svg",
  }))
  const risks = {
    score: Math.floor(60 + Math.random() * 10),
    alerts: [
      { id: 55, type: "支払", message: "売掛金¥1.2億が延滞中", severity: "高", ts: "1日前" },
      { id: 56, type: "市場", message: "競合他社の新製品発表", severity: "中", ts: "3日前" },
      { id: 57, type: "コンプライアンス", message: "環境規制の変更", severity: "低", ts: "1週間前" },
    ],
  }

  // 財務データ（2022-2024年度）
  const financeDummy = [
    { year: 2022, sales: 1.0e12, op: 8.0e10, net: 5.0e10 },
    { year: 2023, sales: 1.05e12, op: 8.4e10, net: 5.2e10 },
    { year: 2024, sales: 1.12e12, op: 8.7e10, net: 5.6e10 },
  ]

  // ニュースデータ（ダミー）
  const news = [
    { id: 1, source: "PR TIMES", title: `${partner.name}、AI研究施設を新設`, url: "#", date: "1日前" },
    { id: 2, source: "日経電子版", title: `${partner.name} が決算発表、増収増益`, url: "#", date: "3日前" },
    { id: 3, source: "ITmedia", title: `${partner.name} と Google が戦略的提携を発表`, url: "#", date: "1週間前" },
    { id: 4, source: "TechCrunch", title: `${partner.name} がスタートアップ企業を買収`, url: "#", date: "2週間前" },
  ]

  // 過去の取引データ
  const history = pastTransactions.filter((t) => t.accountId === params.id)

  // 年度ごとの取引データを集計
  const historyByYear = history.reduce(
    (acc, curr) => {
      const year = curr.year
      if (!acc[year]) {
        acc[year] = { year, revenue: 0, cost: 0 }
      }
      acc[year].revenue += curr.revenue
      acc[year].cost += curr.cost
      return acc
    },
    {} as Record<number, { year: number; revenue: number; cost: number }>,
  )

  const historyData = Object.values(historyByYear).sort((a, b) => a.year - b.year)

  // 財務データの整形
  const mockFin = {
    売上: financeDummy.map((f) => f.sales),
    営業利益: financeDummy.map((f) => f.op),
    純利益: financeDummy.map((f) => f.net),
  }

  // トレンド（前年比）
  const mockTrend = {
    売上: 2.0,
    営業利益: -1.1,
    純利益: 1.8,
  }

  const handleGenerateBrief = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "ブリーフ生成完了",
        description: `${partner.name}のブリーフが生成されました`,
      })
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "高":
        return "border-red-500"
      case "中":
        return "border-yellow-500"
      case "低":
        return "border-green-500"
      default:
        return ""
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "受注":
        return "bg-green-500"
      case "交渉中":
        return "bg-yellow-500"
      case "提案":
      case "案件化":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title={partner.name}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {partner.industry} ({partner.ticker})
          </Badge>
          <Button onClick={handleGenerateBrief} disabled={isGenerating}>
            {isGenerating ? "生成中..." : "ブリーフ生成"}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <Card className="shadow-md rounded-2xl">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="history">過去の取引</TabsTrigger>
                <TabsTrigger value="risk">リスク</TabsTrigger>
                <TabsTrigger value="strategy">戦略</TabsTrigger>
              </TabsList>

              {/* 概要タブ */}
              <TabsContent value="overview" className="space-y-4">
                {/* 財務チャート */}
                <Card>
                  <CardHeader>財務サマリー（過去3年）</CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">読み込み中...</div>}
                    >
                      <FinancialBarChart data={financeDummy} />
                    </Suspense>
                  </CardContent>
                </Card>
                {/* ニュースリスト */}
                <Card>
                  <CardHeader>最新ニュース</CardHeader>
                  <CardContent>
                    {news.map((n) => (
                      <NewsRow key={n.id} {...n} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 過去の取引タブ */}
              <TabsContent value="history" className="space-y-4">
                {/* 取引推移棒グラフ */}
                <Card>
                  <CardHeader>取引金額推移（売上・費用）</CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={<div className="h-[350px] flex items-center justify-center">読み込み中...</div>}
                    >
                      <TransactionBarChart data={historyData} />
                    </Suspense>
                  </CardContent>
                </Card>
                {/* 取引明細テーブル */}
                <Card>
                  <CardHeader>取引明細</CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>当社グループ</TableHead>
                          <TableHead>相手グループ</TableHead>
                          <TableHead>年度</TableHead>
                          <TableHead className="text-right">売上</TableHead>
                          <TableHead className="text-right">費用</TableHead>
                          <TableHead>概要</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.ourCo}</TableCell>
                            <TableCell>{transaction.theirCo}</TableCell>
                            <TableCell>{transaction.year}</TableCell>
                            <TableCell className="text-right">{transaction.revenue}万円</TableCell>
                            <TableCell className="text-right">{transaction.cost}万円</TableCell>
                            <TableCell>{transaction.summary}</TableCell>
                          </TableRow>
                        ))}
                        {history.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              取引データがありません
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">リスクスコア: {risks.score}/100</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {risks.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 border-l-4 rounded-md bg-white ${getSeverityColor(alert.severity)}`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <Badge variant="outline">{alert.type}</Badge>
                            <p className="mt-1">{alert.message}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge
                              variant={
                                alert.severity === "高"
                                  ? "destructive"
                                  : alert.severity === "中"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">{alert.ts}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategy">
                <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-medium">戦略ボード</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    このアカウントの戦略計画と実行状況を確認できます。
                  </p>
                  <Link href={`/strategy/${params.id}?companyName=${encodeURIComponent(partner.name)}`}>
                    <Button>戦略ボードへ</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-4">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>主要コンタクト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={contact.avatarUrl || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" title={contact.phone}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title={contact.email}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
