"use client"

import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"
import { CompanyContextBanner } from "@/components/company-context-banner"

export default function ARPage() {
  return (
    <div>
      <CompanyContextBanner />

      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-96 h-96 bg-gray-300 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">AR VIEW</span>
        </div>
        <div className="mt-8">
          <Button disabled className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            AR起動（準備中）
          </Button>
        </div>
      </div>
    </div>
  )
}
