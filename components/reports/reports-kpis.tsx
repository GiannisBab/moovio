"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import {
  Alert01Icon,
  ChartLineData01Icon,
  Clock01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons"

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import type {
  CongestionRow,
  DailySummaryRow,
  IncidentRow,
  RidershipRow,
} from "@/lib/data/reports-data"

type Props = {
  daily: DailySummaryRow[]
  incidents: IncidentRow[]
  ridership: RidershipRow[]
  congestion: CongestionRow[]
}

export function ReportsKpis({ daily, incidents, ridership, congestion }: Props) {
  const t = useTranslations("Reports")
  const totalRecords =
    daily.length + incidents.length + ridership.length + congestion.length
  const openIncidents = incidents.filter((i) => i.resolvedAt === null).length
  const resolved = incidents.filter((i) => i.resolvedAt !== null)
  const avgResolution =
    resolved.length > 0
      ? Math.round(
          resolved.reduce((sum, i) => sum + i.durationMin, 0) / resolved.length,
        )
      : 0

  const kpis = [
    {
      title: t("recordsInPeriod"),
      value: totalRecords.toLocaleString(),
      icon: File02Icon,
      hint: t("recordsHint", { daily: daily.length, incidents: incidents.length }),
    },
    {
      title: t("openIncidents"),
      value: openIncidents.toString(),
      icon: Alert01Icon,
      hint: t("totalReportedHint", { count: incidents.length }),
    },
    {
      title: t("avgResolution"),
      value: `${avgResolution} min`,
      icon: Clock01Icon,
      hint: t("acrossResolved"),
    },
    {
      title: t("ridershipRecords"),
      value: ridership.length.toString(),
      icon: ChartLineData01Icon,
      hint: t("acrossModes"),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} size="sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <CardAction>
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <HugeiconsIcon icon={kpi.icon} className="size-4 text-muted-foreground" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{kpi.hint}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
