"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { Download } from "lucide-react"
import dynamic from "next/dynamic"

// Only import the 2D version to avoid A-Frame dependency issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
})

export default function NetworkPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "日立製作所"
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] } | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // ウィンドウサイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      const graphContainer = document.getElementById("graph-container")
      if (graphContainer) {
        setDimensions({
          width: graphContainer.clientWidth,
          height: graphContainer.clientHeight,
        })
      }
    }

    handleResize() // 初期サイズを設定
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // グラフデータの初期化
  useEffect(() => {
    // ダミーデータ
    const nodes = [
      { id: "ourExec1", name: "当社社長", group: "MC" },
      { id: "key1", name: `${companyName} 社長`, group: "TP" },
      { id: "gc1", name: "メタルワン 取締役", group: "GroupCo" },
      { id: "gc2", name: "シグマクシス 執行役員", group: "GroupCo" },
      { id: "key2", name: `${companyName} 技術部長`, group: "TP" },
      { id: "key3", name: `${companyName} 営業部長`, group: "TP" },
      { id: "ourExec2", name: "当社副社長", group: "MC" },
      { id: "ourExec3", name: "当社技術部長", group: "MC" },
      { id: "gc3", name: "ローソン 取締役", group: "GroupCo" },
    ]

    const links = [
      { source: "ourExec1", target: "key1", strength: 0.9 },
      { source: "gc1", target: "key1", strength: 0.6 },
      { source: "gc2", target: "key1", strength: 0.5 },
      { source: "ourExec2", target: "key2", strength: 0.7 },
      { source: "ourExec3", target: "key2", strength: 0.8 },
      { source: "gc3", target: "key3", strength: 0.4 },
      { source: "key1", target: "key2", strength: 0.9 },
      { source: "key1", target: "key3", strength: 0.8 },
      { source: "ourExec1", target: "ourExec2", strength: 0.3 },
      { source: "gc1", target: "gc3", strength: 0.2 },
    ]

    setGraphData({ nodes, links })
  }, [companyName])

  // CSVエクスポート機能
  const exportToCSV = () => {
    if (!graphData) return

    // ノードCSV
    const nodeCSV = [
      ["id", "name", "group"].join(","), // ヘッダー
      ...graphData.nodes.map((node) => [node.id, node.name, node.group].join(",")),
    ].join("\n")

    // リンクCSV
    const linkCSV = [
      ["source", "target", "strength"].join(","), // ヘッダー
      ...graphData.links.map((link) => {
        const source = typeof link.source === "object" ? link.source.id : link.source
        const target = typeof link.target === "object" ? link.target.id : link.target
        return [source, target, link.strength].join(",")
      }),
    ].join("\n")

    // 両方のCSVを結合
    const combinedCSV = `# Nodes\n${nodeCSV}\n\n# Links\n${linkCSV}`

    // CSVファイルとしてダウンロード
    const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `network_${companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // グループごとの色を定義
  const getNodeColor = (node: any) => {
    const colors = {
      MC: "#002B5B", // 当社
      TP: "#E60027", // 取引先
      GroupCo: "#00A0E9", // グループ会社
    }
    return colors[node.group as keyof typeof colors] || "#999"
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title={`関係者ネットワーク – ${companyName}`}>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          CSV エクスポート
        </Button>
      </PageHeader>

      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-0" id="graph-container" style={{ height: "70vh" }}>
          {graphData && (
            <ForceGraph2D
              graphData={graphData}
              width={dimensions.width}
              height={dimensions.height}
              nodeLabel="name"
              nodeColor={getNodeColor}
              linkWidth={(link) => (link.strength as number) * 3}
              linkColor={() => "#999"}
              cooldownTicks={100}
              nodeRelSize={6}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
