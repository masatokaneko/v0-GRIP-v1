"use client"

import { useParams, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { CompanyContextBanner } from "@/components/company-context-banner"
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { Calendar, AlertTriangle, FileText, Users, Handshake } from "lucide-react"

export default function TimelinePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const companyName = searchParams.get("companyName") || "日立製作所"

  // Dummy events data
  const events = [
    { date: "2023-04-01", title: "長期供給契約締結", desc: `メタルワン×${companyName}`, type: "契約" },
    { date: "2024-01-15", title: "トップ面談", desc: "当社社長が訪問", type: "面談" },
    { date: "2024-11-30", title: "品質トラブル報告", desc: "遅延発生", type: "リスク" },
    { date: "2025-02-10", title: "共同研究PoC合意", desc: "AIラボ開設", type: "案件" },
  ]

  // Get the appropriate icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "契約":
        return <Handshake />
      case "面談":
        return <Users />
      case "リスク":
        return <AlertTriangle />
      case "案件":
        return <FileText />
      default:
        return <Calendar />
    }
  }

  // Get the appropriate background color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "リスク":
        return "#f44336"
      case "契約":
        return "#4CAF50"
      case "面談":
        return "#2196F3"
      case "案件":
        return "#FF9800"
      default:
        return "#002B5B"
    }
  }

  return (
    <div>
      <CompanyContextBanner />
      <PageHeader title={`タイムライン – ${companyName}`} />

      <div className="mt-6">
        <VerticalTimeline>
          {events.map((event) => (
            <VerticalTimelineElement
              key={`${event.date}-${event.title}`}
              className="vertical-timeline-element"
              date={event.date}
              iconStyle={{ background: getEventColor(event.type), color: "#fff" }}
              icon={getEventIcon(event.type)}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg m-0">{event.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{event.type}</span>
              </div>
              <p className="text-muted-foreground">{event.desc}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  )
}
