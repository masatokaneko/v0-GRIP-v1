"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { tradingPartners } from "@/lib/sampleData"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, FileText, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// サンプルブリーフデータを生成
const briefs = tradingPartners.map((p, i) => ({
  id: i + 1,
  accountId: p.id,
  title: `${p.name} 訪問ブリーフ`,
  date: `2025-05-0${i + 1}`,
  status: Math.random() > 0.3 ? "完了" : "下書き",
}))

// テンプレートオプション
const templateOptions = [
  { value: "standard", label: "標準" },
  { value: "procurement", label: "資材調達" },
  { value: "technical", label: "技術提携" },
  { value: "sales", label: "営業戦略" },
  { value: "executive", label: "役員訪問" },
]

export default function BriefsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [comboboxOpen, setComboboxOpen] = useState(false)

  // ブリーフ表示ハンドラー
  const handleViewBrief = (briefId: number) => {
    router.push(`/brief/${briefId}?companyName=${encodeURIComponent(getBriefCompanyName(briefId))}`)
  }

  // ブリーフの企業名を取得
  const getBriefCompanyName = (briefId: number) => {
    const brief = briefs.find((b) => b.id === briefId)
    if (!brief) return ""
    const partner = tradingPartners.find((p) => p.id === brief.accountId)
    return partner ? partner.name : ""
  }

  // ウィザードのリセット
  const resetWizard = () => {
    setStep(1)
    setSelectedCompany("")
    setSelectedTemplate("")
  }

  // ウィザードの次のステップへ
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  // ブリーフ生成処理
  const handleGenerateBrief = async () => {
    // 選択されていない場合はエラー
    if (!selectedCompany || !selectedTemplate) {
      toast({
        title: "エラー",
        description: "取引先とテンプレートを選択してください",
        variant: "destructive",
      })
      return
    }

    // 生成中トースト
    toast({
      title: "ブリーフを生成中...",
      description: "完了までしばらくお待ちください",
    })

    // APIリクエストをシミュレート
    setTimeout(() => {
      // 新しいブリーフIDは既存の最大ID + 1
      const newId = Math.max(...briefs.map((b) => b.id)) + 1

      // ダイアログを閉じる
      setOpen(false)

      // ウィザードをリセット
      resetWizard()

      // 完了トースト
      toast({
        title: "ブリーフ生成完了",
        description: "新しいブリーフが生成されました",
      })

      // 新しいブリーフページに遷移
      router.push(`/brief/${newId}?companyName=${encodeURIComponent(selectedCompany)}`)
    }, 2000)
  }

  return (
    <div>
      <CompanyContextBanner />

      <PageHeader title="ブリーフ一覧">
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) resetWizard()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              ブリーフ作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {step === 1 && "ステップ 1: 取引先選択"}
                {step === 2 && "ステップ 2: テンプレート選択"}
                {step === 3 && "ステップ 3: ブリーフ生成"}
              </DialogTitle>
            </DialogHeader>

            {/* ステップ1: 取引先選択 */}
            {step === 1 && (
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">取引先企業</label>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between"
                      >
                        {selectedCompany
                          ? tradingPartners.find((partner) => partner.name === selectedCompany)?.name
                          : "取引先を選択..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="企業名を検索..." />
                        <CommandList>
                          <CommandEmpty>該当する企業がありません</CommandEmpty>
                          <CommandGroup>
                            {tradingPartners.map((partner) => (
                              <CommandItem
                                key={partner.id}
                                value={partner.name}
                                onSelect={(currentValue) => {
                                  setSelectedCompany(currentValue)
                                  setComboboxOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCompany === partner.name ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {partner.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={!selectedCompany}>
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ2: テンプレート選択 */}
            {step === 2 && (
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">テンプレート</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="テンプレートを選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templateOptions.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    戻る
                  </Button>
                  <Button onClick={nextStep} disabled={!selectedTemplate}>
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ3: 確認と生成 */}
            {step === 3 && (
              <div className="py-4 space-y-4">
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">取引先:</span>
                    <span className="text-sm">{selectedCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">テンプレート:</span>
                    <span className="text-sm">{templateOptions.find((t) => t.value === selectedTemplate)?.label}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    戻る
                  </Button>
                  <Button onClick={handleGenerateBrief}>生成</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => (
          <Card key={brief.id} className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{brief.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{brief.date}</span>
                <Badge variant={brief.status === "完了" ? "default" : "outline"}>{brief.status}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleViewBrief(brief.id)}>
                <FileText className="mr-2 h-4 w-4" />
                表示
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
