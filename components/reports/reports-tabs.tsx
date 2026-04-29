"use client"

import * as React from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Car01Icon,
  ConstructionIcon,
  Download01Icon,
  OctagonIcon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"
import { useDataLabel } from "@/components/i18n-provider"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReportTable, type ReportColumn } from "@/components/reports/report-table"
import { exportToCsv, type CsvColumn } from "@/lib/csv"
import type {
  CongestionRow,
  DailySummaryRow,
  IncidentRow,
  RidershipRow,
} from "@/lib/data/reports-data"

const SEVERITY_VARIANT = {
  critical: "destructive",
  warning: "outline",
  info: "secondary",
} as const

const STATUS_VARIANT = {
  complete: "secondary",
  partial: "outline",
  pending: "destructive",
} as const

const INCIDENT_ICON = {
  accident: Car01Icon,
  roadwork: ConstructionIcon,
  closure: OctagonIcon,
  event: Calendar01Icon,
} as const

function formatDate(value: string): string {
  const datePart = value.length >= 10 ? value.slice(0, 10) : value
  const time = value.length > 10 ? value.slice(11) : ""
  const d = new Date(`${datePart}T00:00:00Z`)
  return time ? `${format(d, "MMM d, yyyy")} ${time}` : format(d, "MMM d, yyyy")
}

type Props = {
  daily: DailySummaryRow[]
  incidents: IncidentRow[]
  ridership: RidershipRow[]
  congestion: CongestionRow[]
}

function ExportButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
      {label}
    </Button>
  )
}

export function ReportsTabs({ daily, incidents, ridership, congestion }: Props) {
  const t = useTranslations("Reports")
  const tCol = useTranslations("ReportColumns")
  const tIncident = useTranslations("IncidentTypes")
  const tSeverity = useTranslations("Severity")
  const tStatus = useTranslations("Status")
  const dl = useDataLabel()

  const dailyColumns: ReportColumn<DailySummaryRow>[] = [
    { key: "date", header: tCol("date"), render: (r) => formatDate(r.date) },
    {
      key: "totalTrips",
      header: tCol("totalTrips"),
      align: "right",
      render: (r) => r.totalTrips.toLocaleString(),
    },
    {
      key: "avgSpeed",
      header: tCol("avgSpeed"),
      align: "right",
      render: (r) => r.avgSpeed.toFixed(1),
    },
    { key: "incidents", header: tCol("incidents"), align: "right" },
    {
      key: "status",
      header: tCol("status"),
      render: (r) => (
        <Badge variant={STATUS_VARIANT[r.status]}>{tStatus(r.status)}</Badge>
      ),
    },
  ]

  const incidentColumns: ReportColumn<IncidentRow>[] = [
    { key: "date", header: tCol("when"), render: (r) => formatDate(r.date) },
    {
      key: "type",
      header: tCol("type"),
      render: (r) => (
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon
            icon={INCIDENT_ICON[r.type]}
            className="size-3.5 text-muted-foreground"
          />
          {tIncident(r.type)}
        </span>
      ),
    },
    { key: "location", header: tCol("location"), render: (r) => dl(r.location) },
    {
      key: "severity",
      header: tCol("severity"),
      render: (r) => (
        <Badge variant={SEVERITY_VARIANT[r.severity]}>
          {tSeverity(r.severity)}
        </Badge>
      ),
    },
    {
      key: "durationMin",
      header: tCol("duration"),
      align: "right",
      render: (r) => tCol("minutes", { value: r.durationMin }),
    },
    {
      key: "resolvedAt",
      header: tCol("resolved"),
      render: (r) =>
        r.resolvedAt ? (
          <span className="text-muted-foreground">{formatDate(r.resolvedAt)}</span>
        ) : (
          <Badge variant="destructive">{t("open")}</Badge>
        ),
    },
  ]

  const ridershipColumns: ReportColumn<RidershipRow>[] = [
    { key: "date", header: tCol("date"), render: (r) => formatDate(r.date) },
    { key: "mode", header: tCol("mode"), render: (r) => dl(r.mode) },
    { key: "station", header: tCol("station"), render: (r) => dl(r.station) },
    {
      key: "ridership",
      header: tCol("ridership"),
      align: "right",
      render: (r) => r.ridership.toLocaleString(),
    },
    {
      key: "changePct",
      header: tCol("changeVsPrev"),
      align: "right",
      render: (r) => {
        const positive = r.changePct >= 0
        return (
          <span
            className={
              "inline-flex items-center justify-end gap-1 " +
              (positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400")
            }
          >
            <HugeiconsIcon
              icon={positive ? TradeUpIcon : TradeDownIcon}
              className="size-3.5"
            />
            {positive ? "+" : ""}
            {r.changePct.toFixed(1)}%
          </span>
        )
      },
    },
  ]

  const congestionColumns: ReportColumn<CongestionRow>[] = [
    { key: "date", header: tCol("date"), render: (r) => formatDate(r.date) },
    { key: "location", header: tCol("location"), render: (r) => dl(r.location) },
    {
      key: "severity",
      header: tCol("severity"),
      render: (r) => (
        <Badge variant={SEVERITY_VARIANT[r.severity]}>
          {tSeverity(r.severity)}
        </Badge>
      ),
    },
    { key: "peakHour", header: tCol("peakHour"), align: "right" },
    {
      key: "durationMin",
      header: tCol("duration"),
      align: "right",
      render: (r) => tCol("minutes", { value: r.durationMin }),
    },
  ]

  const dailyCsv: CsvColumn<DailySummaryRow>[] = [
    { key: "date", header: tCol("date") },
    { key: "totalTrips", header: tCol("totalTrips") },
    { key: "avgSpeed", header: tCol("avgSpeed") },
    { key: "incidents", header: tCol("incidents") },
    { key: "status", header: tCol("status") },
  ]

  const incidentCsv: CsvColumn<IncidentRow>[] = [
    { key: "date", header: tCol("when") },
    { key: "type", header: tCol("type") },
    { key: "location", header: tCol("location") },
    { key: "severity", header: tCol("severity") },
    { key: "durationMin", header: tCol("duration") },
    {
      key: "resolvedAt",
      header: tCol("resolved"),
      format: (v) => (v ? String(v) : t("open")),
    },
  ]

  const ridershipCsv: CsvColumn<RidershipRow>[] = [
    { key: "date", header: tCol("date") },
    { key: "mode", header: tCol("mode") },
    { key: "station", header: tCol("station") },
    { key: "ridership", header: tCol("ridership") },
    { key: "changePct", header: tCol("changeVsPrev") },
  ]

  const congestionCsv: CsvColumn<CongestionRow>[] = [
    { key: "date", header: tCol("date") },
    { key: "location", header: tCol("location") },
    { key: "severity", header: tCol("severity") },
    { key: "peakHour", header: tCol("peakHour") },
    { key: "durationMin", header: tCol("duration") },
  ]

  return (
    <Tabs defaultValue="daily" className="gap-4">
      <TabsList>
        <TabsTrigger value="daily">{t("tabDaily")}</TabsTrigger>
        <TabsTrigger value="incidents">{t("tabIncidents")}</TabsTrigger>
        <TabsTrigger value="ridership">{t("tabRidership")}</TabsTrigger>
        <TabsTrigger value="congestion">{t("tabCongestion")}</TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {t("daysInPeriod", { count: daily.length })}
            </p>
            <ExportButton
              label={t("exportCsv")}
              onClick={() =>
                exportToCsv("moovio-daily-summary", dailyCsv, daily)
              }
            />
          </div>
          <ReportTable
            columns={dailyColumns}
            rows={daily}
            initialSortKey="date"
          />
        </div>
      </TabsContent>

      <TabsContent value="incidents">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {t("incidentsReported", { count: incidents.length })}
            </p>
            <ExportButton
              label={t("exportCsv")}
              onClick={() =>
                exportToCsv("moovio-incidents", incidentCsv, incidents)
              }
            />
          </div>
          <ReportTable
            columns={incidentColumns}
            rows={incidents}
            initialSortKey="date"
          />
        </div>
      </TabsContent>

      <TabsContent value="ridership">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {t("ridershipEntries", { count: ridership.length })}
            </p>
            <ExportButton
              label={t("exportCsv")}
              onClick={() =>
                exportToCsv("moovio-ridership", ridershipCsv, ridership)
              }
            />
          </div>
          <ReportTable
            columns={ridershipColumns}
            rows={ridership}
            initialSortKey="ridership"
          />
        </div>
      </TabsContent>

      <TabsContent value="congestion">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {t("congestionEvents", { count: congestion.length })}
            </p>
            <ExportButton
              label={t("exportCsv")}
              onClick={() =>
                exportToCsv("moovio-congestion", congestionCsv, congestion)
              }
            />
          </div>
          <ReportTable
            columns={congestionColumns}
            rows={congestion}
            initialSortKey="date"
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
