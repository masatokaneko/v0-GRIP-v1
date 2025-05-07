"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  Save,
  Database,
  FileText,
  Mail,
  Video,
  CreditCard,
  Globe,
  Check,
  RefreshCw,
  Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// データソース定義
const dataSources = [
  {
    id: 1,
    category: "CRM",
    name: "Salesforce (本社)",
    connectionType: "REST Bulk API",
    tables: "Account, Contact, Opportunity, Task",
    frequency: "15 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:15",
    nextSync: "2025-05-07 10:30",
  },
  {
    id: 2,
    category: "CRM",
    name: "Dynamics 365 (海外社)",
    connectionType: "OData",
    tables: "Account, Opportunity",
    frequency: "1 h",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 11:00",
  },
  {
    id: 3,
    category: "CRM",
    name: "Zoho CRM (一部社)",
    connectionType: "REST",
    tables: "Lead, Deal",
    frequency: "1 h",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 11:00",
  },
  {
    id: 4,
    category: "ERP/会計",
    name: "SAP S/4",
    connectionType: "IDoc → MuleSoft",
    tables: "SalesOrder, AR, AP",
    frequency: "30 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 10:30",
  },
  {
    id: 5,
    category: "ERP/会計",
    name: "Oracle E-BS",
    connectionType: "JDBC → Fivetran",
    tables: "AR, AP",
    frequency: "30 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 10:30",
  },
  {
    id: 6,
    category: "ERP/会計",
    name: "freee 会計",
    connectionType: "REST",
    tables: "Voucher, Payment",
    frequency: "1 h",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 11:00",
  },
  {
    id: 7,
    category: "文書",
    name: "SharePoint / Box / G-Drive",
    connectionType: "Graph / API",
    tables: "Contracts(PDF), Minutes",
    frequency: "4 h",
    status: "接続済み",
    lastSync: "2025-05-07 08:00",
    nextSync: "2025-05-07 12:00",
  },
  {
    id: 8,
    category: "コミュニケーション",
    name: "Microsoft 365 (メール・予定)",
    connectionType: "Graph API (delta)",
    tables: "Message, Event",
    frequency: "10 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:10",
    nextSync: "2025-05-07 10:20",
  },
  {
    id: 9,
    category: "コミュニケーション",
    name: "Google Workspace",
    connectionType: "Gmail / Calendar API",
    tables: "Message, Event",
    frequency: "10 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:10",
    nextSync: "2025-05-07 10:20",
  },
  {
    id: 10,
    category: "音声 / 会議",
    name: "MS Teams / Zoom",
    connectionType: "Webhook",
    tables: "Recording URL, Transcript",
    frequency: "near-real",
    status: "接続済み",
    lastSync: "2025-05-07 10:15",
    nextSync: "リアルタイム",
  },
  {
    id: 11,
    category: "名刺OCR",
    name: "Sansan API",
    connectionType: "REST",
    tables: "Card, Person",
    frequency: "on-insert",
    status: "接続済み",
    lastSync: "2025-05-07 09:45",
    nextSync: "イベント発生時",
  },
  {
    id: 12,
    category: "外部データ",
    name: "SPEEDA / FactSet",
    connectionType: "SFTP / REST",
    tables: "Company, Executive, News",
    frequency: "daily",
    status: "接続済み",
    lastSync: "2025-05-07 00:00",
    nextSync: "2025-05-08 00:00",
  },
  {
    id: 13,
    category: "外部データ",
    name: "News API / RSS",
    connectionType: "HTTP",
    tables: "Article",
    frequency: "5 min",
    status: "接続済み",
    lastSync: "2025-05-07 10:15",
    nextSync: "2025-05-07 10:20",
  },
  {
    id: 14,
    category: "外部データ",
    name: "SNS (X, LinkedIn)",
    connectionType: "Public API / Scraper",
    tables: "Post, Engagement",
    frequency: "1 h",
    status: "接続済み",
    lastSync: "2025-05-07 10:00",
    nextSync: "2025-05-07 11:00",
  },
]

// 外部システム連携
const externalSystems = [
  { id: 1, name: "Salesforce", connectionType: "API", status: "接続済み" },
  { id: 2, name: "freee", connectionType: "OAuth", status: "接続済み" },
  { id: 3, name: "SAP", connectionType: "JDBC", status: "未接続" },
]

const fieldMappings = [
  { externalField: "Account.Name", internalField: "tradingPartner.name" },
  { externalField: "Account.Industry", internalField: "tradingPartner.industry" },
  { externalField: "Account.AnnualRevenue", internalField: "tradingPartner.revenueFY24" },
  { externalField: "Opportunity.Name", internalField: "opportunity.name" },
  { externalField: "Opportunity.Amount", internalField: "opportunity.amountJPY" },
  { externalField: "Opportunity.StageName", internalField: "opportunity.stage" },
]

// カテゴリーごとのアイコン
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "CRM":
      return <Database className="h-4 w-4" />
    case "ERP/会計":
      return <FileText className="h-4 w-4" />
    case "文書":
      return <FileText className="h-4 w-4" />
    case "コミュニケーション":
      return <Mail className="h-4 w-4" />
    case "音声 / 会議":
      return <Video className="h-4 w-4" />
    case "名刺OCR":
      return <CreditCard className="h-4 w-4" />
    case "外部データ":
      return <Globe className="h-4 w-4" />
    default:
      return <Database className="h-4 w-4" />
  }
}

export default function SettingsPage() {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null)
  const [showMappingSheet, setShowMappingSheet] = useState(false)
  const [newsEnabled, setNewsEnabled] = useState(true)
  const [newsApiKey, setNewsApiKey] = useState("sk-news-xxxxxxxxxxxx")
  const [importanceThreshold, setImportanceThreshold] = useState("medium")
  const [userRole, setUserRole] = useState("EXEC") // "USER" | "ADMIN" | "EXEC"
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAddSourceSheet, setShowAddSourceSheet] = useState(false)

  const handleSaveNewsSettings = () => {
    // 実際の実装ではAPIリクエストを送信
    alert("ニュース設定を保存しました")
  }

  const handleSyncNow = (sourceId: number) => {
    alert(`ID: ${sourceId} の同期を開始しました`)
  }

  // カテゴリーでフィルタリングされたデータソース
  const filteredDataSources = selectedCategory
    ? dataSources.filter((ds) => ds.category === selectedCategory)
    : dataSources

  // 権限チェック
  if (userRole !== "EXEC") {
    return (
      <div>
        <CompanyContextBanner />
        <PageHeader title="設定" />
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>権限エラー</AlertTitle>
          <AlertDescription>この画面にアクセスするには管理者権限が必要です。</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <CompanyContextBanner />
      <PageHeader title="設定" />

      <Tabs defaultValue="datasources" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="datasources">データソース</TabsTrigger>
          <TabsTrigger value="import">データ取込</TabsTrigger>
          <TabsTrigger value="news">ニュース設定</TabsTrigger>
        </TabsList>

        <TabsContent value="datasources" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                すべて
              </Button>
              {Array.from(new Set(dataSources.map((ds) => ds.category))).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  {getCategoryIcon(category)}
                  {category}
                </Button>
              ))}
            </div>
            <Sheet open={showAddSourceSheet} onOpenChange={setShowAddSourceSheet}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  データソース追加
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>新規データソース追加</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-category">カテゴリー</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリーを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set(dataSources.map((ds) => ds.category))).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-name">データソース名</Label>
                    <Input id="source-name" placeholder="例: Salesforce (営業部)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connection-type">接続方式</Label>
                    <Input id="connection-type" placeholder="例: REST API" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connection-url">接続URL</Label>
                    <Input id="connection-url" placeholder="例: https://api.example.com/v1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auth-type">認証方式</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="認証方式を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                        <SelectItem value="basic">Basic認証</SelectItem>
                        <SelectItem value="jwt">JWT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">同期頻度</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="同期頻度を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5min">5分</SelectItem>
                        <SelectItem value="15min">15分</SelectItem>
                        <SelectItem value="30min">30分</SelectItem>
                        <SelectItem value="1h">1時間</SelectItem>
                        <SelectItem value="4h">4時間</SelectItem>
                        <SelectItem value="daily">日次</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={() => setShowAddSourceSheet(false)}>追加</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>データソース一覧</CardTitle>
              <CardDescription>
                {selectedCategory ? `${selectedCategory}カテゴリーのデータソース` : "すべてのデータソース"} (
                {filteredDataSources.length}件)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>データソース</TableHead>
                    <TableHead>接続方式</TableHead>
                    <TableHead>主テーブル</TableHead>
                    <TableHead>更新頻度</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDataSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(source.category)}
                          <span>{source.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>{source.connectionType}</TableCell>
                      <TableCell>{source.tables}</TableCell>
                      <TableCell>{source.frequency}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`source-${source.id}`} className="border-none">
                            <AccordionTrigger className="py-0">詳細</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">最終同期:</span>
                                  <span>{source.lastSync}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">次回同期:</span>
                                  <span>{source.nextSync}</span>
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleSyncNow(source.id)}
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                    今すぐ同期
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedSystem(source.id)
                                      setShowMappingSheet(true)
                                    }}
                                  >
                                    マッピング編集
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>外部システム連携</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>システム名</TableHead>
                    <TableHead>接続方式</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="text-right">マッピング</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {externalSystems.map((system) => (
                    <TableRow key={system.id}>
                      <TableCell className="font-medium">{system.name}</TableCell>
                      <TableCell>{system.connectionType}</TableCell>
                      <TableCell>{system.status}</TableCell>
                      <TableCell className="text-right">
                        <Sheet
                          open={showMappingSheet && selectedSystem === system.id}
                          onOpenChange={(open) => {
                            setShowMappingSheet(open)
                            if (!open) setSelectedSystem(null)
                          }}
                        >
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSystem(system.id)
                                setShowMappingSheet(true)
                              }}
                            >
                              マッピング編集
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-md">
                            <SheetHeader>
                              <SheetTitle>{system.name} フィールドマッピング</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>外部フィールド</TableHead>
                                    <TableHead>内部フィールド</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {fieldMappings.map((mapping, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{mapping.externalField}</TableCell>
                                      <TableCell>{mapping.internalField}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ニュース取得設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="news-enabled" checked={newsEnabled} onCheckedChange={setNewsEnabled} />
                <Label htmlFor="news-enabled">自動ニュース取込を有効化</Label>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-key" className="text-right">
                    ニュース API Key
                  </Label>
                  <Input
                    id="api-key"
                    value={newsApiKey}
                    onChange={(e) => setNewsApiKey(e.target.value)}
                    className="col-span-3"
                    disabled={!newsEnabled}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    重要度閾値
                  </Label>
                  <Select value={importanceThreshold} onValueChange={setImportanceThreshold} disabled={!newsEnabled}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="重要度を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNewsSettings} disabled={!newsEnabled}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
