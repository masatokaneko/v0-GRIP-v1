"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { dealSearchPool, groupCompanies } from "@/lib/sampleData"
import { Search } from "lucide-react"

type Filters = {
  ourCo: string
  stage: string
  amount: string
}

export default function DealsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<Filters>({
    ourCo: "",
    stage: "",
    amount: "",
  })
  const [results, setResults] = useState(dealSearchPool)

  const handleSearch = () => {
    let filtered = [...dealSearchPool]

    if (filters.ourCo) {
      filtered = filtered.filter((deal) => deal.ourCo === filters.ourCo)
    }

    if (filters.stage) {
      const stageNum = Number.parseInt(filters.stage)
      filtered = filtered.filter((deal) => deal.stage === stageNum)
    }

    if (filters.amount) {
      switch (filters.amount) {
        case "small":
          filtered = filtered.filter((deal) => deal.amount < 1000000000) // 10億未満
          break
        case "medium":
          filtered = filtered.filter((deal) => deal.amount >= 1000000000 && deal.amount <= 5000000000) // 10-50億
          break
        case "large":
          filtered = filtered.filter((deal) => deal.amount > 5000000000) // 50億超
          break
      }
    }

    setResults(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const getStageLabel = (stage: number) => {
    const labels = ["初期検討", "提案準備", "提案中", "交渉中", "受注決定"]
    return labels[stage - 1] || `ステージ${stage}`
  }

  const getStageColor = (stage: number) => {
    const colors = [
      "bg-gray-500", // 初期検討
      "bg-blue-500", // 提案準備
      "bg-yellow-500", // 提案中
      "bg-orange-500", // 交渉中
      "bg-green-500", // 受注決定
    ]
    return colors[stage - 1] || "bg-gray-500"
  }

  const handleRowClick = (theirCo: string) => {
    // 企業名から企業IDを取得する簡易的な方法（実際はもっと堅牢な方法が必要）
    const accountId =
      theirCo === "日立製作所" ? "hitachi" : theirCo === "富士通" ? "fujitsu" : theirCo === "NEC" ? "nec" : "nttdata"
    router.push(`/account/${accountId}?companyName=${encodeURIComponent(theirCo)}`)
  }

  return (
    <div>
      <CompanyContextBanner />
      <PageHeader title="商談検索" />

      <Card className="mb-6 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>検索条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">当社グループ会社</label>
              <Select value={filters.ourCo} onValueChange={(value) => setFilters({ ...filters, ourCo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {groupCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ステージ</label>
              <Select value={filters.stage} onValueChange={(value) => setFilters({ ...filters, stage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="1">1: 初期検討</SelectItem>
                  <SelectItem value="2">2: 提案準備</SelectItem>
                  <SelectItem value="3">3: 提案中</SelectItem>
                  <SelectItem value="4">4: 交渉中</SelectItem>
                  <SelectItem value="5">5: 受注決定</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">金額規模</label>
              <Select value={filters.amount} onValueChange={(value) => setFilters({ ...filters, amount: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="small">10億円未満</SelectItem>
                  <SelectItem value="medium">10億円〜50億円</SelectItem>
                  <SelectItem value="large">50億円超</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                検索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>検索結果 ({results.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>当社グループ会社</TableHead>
                <TableHead>相手企業</TableHead>
                <TableHead>キーマン</TableHead>
                <TableHead>提案内容</TableHead>
                <TableHead>クローズ予定日</TableHead>
                <TableHead>ステージ</TableHead>
                <TableHead className="text-right">金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((deal) => (
                  <TableRow
                    key={deal.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(deal.theirCo)}
                  >
                    <TableCell>{deal.ourCo}</TableCell>
                    <TableCell className="font-medium">{deal.theirCo}</TableCell>
                    <TableCell>{deal.keyman}</TableCell>
                    <TableCell>{deal.content}</TableCell>
                    <TableCell>{deal.close}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(deal.stage)}>{getStageLabel(deal.stage)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(deal.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    検索条件に一致する商談はありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
