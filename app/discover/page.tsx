"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function DiscoverPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const companyName = searchParams.get("companyName") || "日立製作所"

  const mockData = {
    recs: [
      { id: "ABC", grpCo: "ABCロジスティクス", account: companyName, score: 0.84, value: 3e8 },
      { id: "XYZ", grpCo: "XYZエンジニアリング", account: "NEC", score: 0.77, value: 1.2e8 },
      { id: "DEF", grpCo: "DEFテクノロジー", account: "富士通", score: 0.72, value: 2.5e8 },
      { id: "GHI", grpCo: "GHIコンサルティング", account: "NTTデータ", score: 0.68, value: 9e7 },
      { id: "JKL", grpCo: "JKLマニュファクチャリング", account: "東芝", score: 0.65, value: 1.8e8 },
    ],
  }

  const handleCreateDeal = (id: string, grpCo: string) => {
    toast({
      title: "ディール作成",
      description: `${grpCo}のオポチュニティからディールを作成しました`,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  // ヒートマップのセルを生成
  const generateHeatmapCells = () => {
    const cells = []
    const industries = ["製造", "小売", "金融", "IT", "物流", "医療", "建設", "エネルギー"]
    const regions = ["東京", "大阪", "名古屋", "福岡", "札幌", "広島"]

    for (let i = 0; i < industries.length; i++) {
      for (let j = 0; j < regions.length; j++) {
        // ランダムなスコア (0.3 ~ 0.9)
        const score = Math.random() * 0.6 + 0.3
        const opacity = score.toFixed(1)
        const isHighlighted = score > 0.75

        cells.push(
          <div
            key={`${i}-${j}`}
            className={`w-full h-16 flex items-center justify-center border ${
              isHighlighted ? "border-[#002B5B]" : "border-gray-200"
            }`}
            style={{ backgroundColor: `rgba(0, 43, 91, ${opacity})` }}
          >
            <span className={`text-xs font-medium ${score > 0.5 ? "text-white" : "text-black"}`}>
              {(score * 100).toFixed(0)}
            </span>
          </div>,
        )
      }
    }
    return cells
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title="オポチュニティ発見" />

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 md:col-span-8 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>オポチュニティヒートマップ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">業種</span>
                <div className="flex space-x-1">
                  {["製造", "小売", "金融", "IT", "物流", "医療", "建設", "エネルギー"].map((industry) => (
                    <span key={industry} className="text-xs px-2 py-1 bg-muted rounded-md">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">地域</span>
              <div className="flex space-x-1">
                {["東京", "大阪", "名古屋", "福岡", "札幌", "広島"].map((region) => (
                  <span key={region} className="text-xs px-2 py-1 bg-muted rounded-md">
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">{generateHeatmapCells()}</div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-[#002B5B] opacity-30"></div>
                <span className="text-xs">低スコア</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-[#002B5B] opacity-90"></div>
                <span className="text-xs">高スコア</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-4 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>推奨オポチュニティ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>グループ会社</TableHead>
                  <TableHead>スコア</TableHead>
                  <TableHead>推定価値</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.recs.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{rec.grpCo}</p>
                        <p className="text-xs text-muted-foreground">{rec.account}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 mr-2">
                          <div className="absolute inset-0 rounded-full border-2 border-[#002B5B]"></div>
                          <div
                            className="absolute inset-0 rounded-full bg-[#002B5B]"
                            style={{
                              clipPath: `inset(0 0 ${100 - rec.score * 100}% 0)`,
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {(rec.score * 100).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(rec.value)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleCreateDeal(rec.id, rec.grpCo)}>
                        作成
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
