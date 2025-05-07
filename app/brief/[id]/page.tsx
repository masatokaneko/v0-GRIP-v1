"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, FileText, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function BriefPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const companyName = searchParams.get("companyName") || "日立製作所"

  const mockData = {
    brief: {
      id: 777,
      title: `${companyName} 役員訪問ブリーフ`,
      created: "2025-05-07 07:55",
      sections: ["企業概要", "商談パイプライン", "リスクレーダー"],
      files: { pdf: "/brief.pdf", ppt: "/brief.pptx", mp3: "/brief.mp3" },
    },
  }

  const handleRegenerate = () => {
    toast({
      title: "再生成リクエスト送信",
      description: "ブリーフを再生成しています。完了までしばらくお待ちください。",
    })
  }

  return (
    <div>
      <CompanyContextBanner />

      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-3xl">
          <div className="text-sm breadcrumbs mb-4">
            <ul className="flex items-center space-x-2">
              <li>
                <Link
                  href={`/portal?companyName=${encodeURIComponent(companyName)}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ホーム
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  ブリーフ
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-foreground">{mockData.brief.title}</span>
              </li>
            </ul>
          </div>

          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">{mockData.brief.title}</CardTitle>
              <p className="text-sm text-muted-foreground">作成日時: {mockData.brief.created}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">セクション</h3>
                <ul className="space-y-2">
                  {mockData.brief.sections.map((section, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{section}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">ダウンロード</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    PPTX
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    音声(MP3)
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={handleRegenerate}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  再生成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
