"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, FileText } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { tradingPartners } from "@/lib/sampleData"
import Image from "next/image"

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "日立製作所"

  // 未解決リスク数 = tradingPartners.length * 1 でダミー計算
  const unsolvedRisks = tradingPartners.length
  // 自動生成ブリーフ率 = 82 固定
  const autoBriefRate = 82

  const mockData = {
    notifications: [
      ...tradingPartners.map((tp, index) => ({
        id: index + 1,
        type: "Brief",
        message: `${tp.name} 訪問ブリーフが生成されました`,
        ts: "1日前",
      })),
      { id: 100, type: "Risk", message: "市場変動アラート：半導体価格上昇", ts: "3日前" },
    ],
    kpis: [
      { title: "自動生成ブリーフ率", value: autoBriefRate, unit: "%", trend: +4 },
      { title: "未解決リスク数", value: unsolvedRisks, unit: "件", trend: -1 },
      { title: "商談成約率", value: 68, unit: "%", trend: +2 },
      { title: "平均対応時間", value: 3.5, unit: "時間", trend: -0.5 },
    ],
  }

  return (
    <div>
      <CompanyContextBanner />

      <div className="flex justify-center mb-8">
        <Image
          src="/grip-logo-compact.png"
          alt="GRIP - Group-integrated Relationship Intelligence Platform"
          width={300}
          height={70}
          priority
        />
      </div>

      <PageHeader title="ホーム">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              手動でブリーフ作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>ブリーフ作成</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  企業名
                </Label>
                <Input id="company" defaultValue={companyName} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  ブリーフタイプ
                </Label>
                <select
                  id="type"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>役員訪問</option>
                  <option>四半期レビュー</option>
                  <option>リスク分析</option>
                  <option>戦略提案</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>作成</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 md:col-span-8 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>通知センター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border"
                >
                  <div className="flex items-center">
                    <Badge variant={notification.type === "Risk" ? "destructive" : "default"} className="mr-3">
                      {notification.type}
                    </Badge>
                    <span>{notification.message}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{notification.ts}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-4 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>主要KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.kpis.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{kpi.title}</span>
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-2">
                      {kpi.value}
                      {kpi.unit}
                    </span>
                    <div className={`flex items-center ${kpi.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                      {kpi.trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      <span className="text-sm">{Math.abs(kpi.trend)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
