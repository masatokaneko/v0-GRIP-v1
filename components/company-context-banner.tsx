"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Building } from "lucide-react"
import { Suspense } from "react"

// 内部コンポーネントを作成して、useSearchParamsを使用する部分を分離
function CompanyContextContent() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "日立製作所"

  // 企業ごとのテーマカラー
  const getCompanyColor = (name: string) => {
    switch (name) {
      case "日立製作所":
        return "bg-[#e60027]/5 border-[#e60027]/20 text-[#e60027]"
      case "NEC":
        return "bg-[#1e22aa]/5 border-[#1e22aa]/20 text-[#1e22aa]"
      case "富士通":
        return "bg-[#ff0000]/5 border-[#ff0000]/20 text-[#ff0000]"
      case "NTTデータ":
        return "bg-[#00a0e9]/5 border-[#00a0e9]/20 text-[#00a0e9]"
      default:
        return "bg-[#002B5B]/5 border-[#002B5B]/20 text-[#002B5B]"
    }
  }

  const colorClass = getCompanyColor(companyName)
  const colorParts = colorClass.split(" ")
  const bgColor = colorParts[0]
  const borderColor = colorParts[1]
  const textColor = colorParts[2]

  return (
    <Card className={`mb-4 ${bgColor} ${borderColor}`}>
      <CardContent className="p-3 flex items-center">
        <Building className={`h-5 w-5 mr-2 ${textColor}`} />
        <span className={`font-medium ${textColor}`}>
          現在表示中: <strong>{companyName}</strong>
        </span>
      </CardContent>
    </Card>
  )
}

// メインコンポーネントはSuspenseでラップ
export function CompanyContextBanner() {
  return (
    <Suspense
      fallback={
        <Card className="mb-4 bg-[#002B5B]/5 border-[#002B5B]/20">
          <CardContent className="p-3 flex items-center">
            <Building className="h-5 w-5 mr-2 text-[#002B5B]" />
            <span className="font-medium text-[#002B5B]">読み込み中...</span>
          </CardContent>
        </Card>
      }
    >
      <CompanyContextContent />
    </Suspense>
  )
}
