"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function RiskPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "アクメ株式会社"
  const [filter, setFilter] = useState("all")
  const [alerts, setAlerts] = useState<any[]>([])

  // 初期アラート
  const initialAlerts = [
    { id: 1, account: companyName, level: "高", message: "売掛金 延滞 ¥1.2億", ts: "09:12" },
    { id: 2, account: "NEC", level: "中", message: "ネガティブニュース検知", ts: "08:50" },
    { id: 3, account: "富士通", level: "低", message: "軽微な契約違反", ts: "08:30" },
    { id: 4, account: "NTTデータ", level: "中", message: "サプライチェーン遅延", ts: "08:15" },
    { id: 5, account: "東芝", level: "高", message: "コンプライアンス違反の可能性", ts: "08:00" },
  ]

  // 追加アラート
  const additionalAlerts = [
    { id: 6, account: "ソニー", level: "中", message: "配送遅延の増加", ts: "09:25" },
    { id: 7, account: companyName, level: "高", message: "重要顧客の契約見直し", ts: "09:30" },
    { id: 8, account: "パナソニック", level: "低", message: "システム一時停止", ts: "09:35" },
  ]

  useEffect(() => {
    setAlerts(initialAlerts)

    // 擬似SSEで新しいアラートを追加
    const timer1 = setTimeout(() => {
      setAlerts((prev) => [...prev, additionalAlerts[0]])
    }, 5000)

    const timer2 = setTimeout(() => {
      setAlerts((prev) => [...prev, additionalAlerts[1]])
    }, 10000)

    const timer3 = setTimeout(() => {
      setAlerts((prev) => [...prev, additionalAlerts[2]])
    }, 15000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [companyName])

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((alert) => alert.level === filter)

  const getLevelDot = (level: string) => {
    switch (level) {
      case "高":
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>
      case "中":
        return <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      case "低":
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-500"></div>
    }
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title="リスクレーダー">
        <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value)}>
          <ToggleGroupItem value="all">すべて</ToggleGroupItem>
          <ToggleGroupItem value="高">高</ToggleGroupItem>
          <ToggleGroupItem value="中">中</ToggleGroupItem>
          <ToggleGroupItem value="低">低</ToggleGroupItem>
        </ToggleGroup>
      </PageHeader>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>リスクアラート</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>レベル</TableHead>
                <TableHead>取引先</TableHead>
                <TableHead>メッセージ</TableHead>
                <TableHead>時間</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLevelDot(alert.level)}
                      <Badge
                        variant={alert.level === "高" ? "destructive" : alert.level === "中" ? "default" : "outline"}
                      >
                        {alert.level}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{alert.account}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.ts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
