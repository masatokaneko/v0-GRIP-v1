"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Progress } from "@/components/ui/progress"
import { Filter, Plus } from "lucide-react"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function StrategyPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "日立製作所"
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("all")

  const mockData = {
    items: [
      { id: 1, theme: "グリーンエネルギーJV", owner: "佐藤", deadline: "2025-09-30", pct: 40, risk: "中" },
      { id: 2, theme: "価格改定提案", owner: "李", deadline: "2025-06-15", pct: 10, risk: "高" },
      { id: 3, theme: "デジタル変革プロジェクト", owner: "田中", deadline: "2025-08-20", pct: 65, risk: "低" },
      { id: 4, theme: "サプライチェーン最適化", owner: "鈴木", deadline: "2025-07-10", pct: 25, risk: "中" },
      { id: 5, theme: "新規市場参入調査", owner: "山本", deadline: "2025-10-05", pct: 5, risk: "高" },
    ],
  }

  const filteredItems = filter === "all" ? mockData.items : mockData.items.filter((item) => item.risk === filter)

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "高":
        return <Badge variant="destructive">{risk}</Badge>
      case "中":
        return <Badge variant="default">{risk}</Badge>
      case "低":
        return <Badge variant="outline">{risk}</Badge>
      default:
        return <Badge variant="outline">{risk}</Badge>
    }
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title={`戦略ボード – ${companyName}`}>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>戦略テーマ追加</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="theme" className="text-right">
                    テーマ
                  </Label>
                  <Input id="theme" placeholder="戦略テーマを入力" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="owner" className="text-right">
                    担当者
                  </Label>
                  <Input id="owner" placeholder="担当者名" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">
                    期限
                  </Label>
                  <Input id="deadline" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="risk" className="text-right">
                    リスク
                  </Label>
                  <select
                    id="risk"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option>低</option>
                    <option>中</option>
                    <option>高</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setOpen(false)}>追加</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center border rounded-md p-1">
            <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            >
              <option value="all">すべて</option>
              <option value="高">高リスク</option>
              <option value="中">中リスク</option>
              <option value="低">低リスク</option>
            </select>
          </div>
        </div>
      </PageHeader>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>戦略テーマ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>テーマ</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>期限</TableHead>
                <TableHead>進捗</TableHead>
                <TableHead>リスク</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{item.theme}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.pct} className="h-2 w-[100px]" />
                      <span className="text-sm">{item.pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(item.risk)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
