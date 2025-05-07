"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ページが見つかりません</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-muted-foreground text-center">お探しのページは存在しないか、移動した可能性があります。</p>
          <Link href="/portal">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              ホームに戻る
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
