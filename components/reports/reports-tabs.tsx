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

const dailyColumns: ReportColumn<DailySummaryRow>[] = [
  {
    key: "date",
    header: "Date",
    render: (r) => formatDate(r.date),
  },
  {
    key: "totalTrips",
    header: "Total Trips",
    align: "right",
    render: (r) => r.totalTrips.toLocaleString(),
  },
  {
    key: "avgSpeed",
    header: "Avg Speed (km/h)",
    align: "right",
    render: (r) => r.avgSpeed.toFixed(1),
  },
  {
    key: "incidents",
    header: "Incidents",
    align: "right",
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge variant={STATUS_VARIANT[r.status]} className="capitalize">
        {r.status}
      </Badge>
    ),
  },
]

const incidentColumns: ReportColumn<IncidentRow>[] = [
  {
    key: "date",
    header: "When",
    render: (r) => formatDate(r.date),
  },
  {
    key: "type",
    header: "Type",
    render: (r) => (
      <span className="inline-flex items-center gap-1.5 capitalize">
        <HugeiconsIcon
          icon={INCIDENT_ICON[r.type]}
          className="size-3.5 text-muted-foreground"
        />
        {r.type}
      </span>
    ),
  },
  { key: "location", header: "Location" },
  {
    key: "severity",
    header: "Severity",
    render: (r) => (
      <Badge variant={SEVERITY_VARIANT[r.severity]} className="capitalize">
        {r.severity}
      </Badge>
    ),
  },
  {
    key: "durationMin",
    header: "Duration",
    align: "right",
    render: (r) => `${r.durationMin} min`,
  },
  {
    key: "resolvedAt",
    header: "Resolved",
    render: (r) =>
      r.resolvedAt ? (
        <span className="text-muted-foreground">{formatDate(r.resolvedAt)}</span>
      ) : (
        <Badge variant="destructive">Open</Badge>
      ),
  },
]

const ridershipColumns: ReportColumn<RidershipRow>[] = [
  {
    key: "date",
    header: "Date",
    render: (r) => formatDate(r.date),
  },
  { key: "mode", header: "Mode" },
  { key: "station", header: "Station" },
  {
    key: "ridership",
    header: "Ridership",
    align: "right",
    render: (r) => r.ridership.toLocaleString(),
  },
  {
    key: "changePct",
    header: "Δ vs prev",
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
  {
    key: "date",
    header: "Date",
    render: (r) => formatDate(r.date),
  },
  { key: "location", header: "Location" },
  {
    key: "severity",
    header: "Severity",
    render: (r) => (
      <Badge variant={SEVERITY_VARIANT[r.severity]} className="capitalize">
        {r.severity}
      </Badge>
    ),
  },
  { key: "peakHour", header: "Peak Hour", align: "right" },
  {
    key: "durationMin",
    header: "Duration",
    align: "right",
    render: (r) => `${r.durationMin} min`,
  },
]

const dailyCsv: CsvColumn<DailySummaryRow>[] = [
  { key: "date", header: "Date" },
  { key: "totalTrips", header: "Total Trips" },
  { key: "avgSpeed", header: "Avg Speed (km/h)" },
  { key: "incidents", header: "Incidents" },
  { key: "status", header: "Status" },
]

const incidentCsv: CsvColumn<IncidentRow>[] = [
  { key: "date", header: "When" },
  { key: "type", header: "Type" },
  { key: "location", header: "Location" },
  { key: "severity", header: "Severity" },
  { key: "durationMin", header: "Duration (min)" },
  { key: "resolvedAt", header: "Resolved At", format: (v) => (v ? String(v) : "Open") },
]

const ridershipCsv: CsvColumn<RidershipRow>[] = [
  { key: "date", header: "Date" },
  { key: "mode", header: "Mode" },
  { key: "station", header: "Station" },
  { key: "ridership", header: "Ridership" },
  { key: "changePct", header: "Change (%)" },
]

const congestionCsv: CsvColumn<CongestionRow>[] = [
  { key: "date", header: "Date" },
  { key: "location", header: "Location" },
  { key: "severity", header: "Severity" },
  { key: "peakHour", header: "Peak Hour" },
  { key: "durationMin", header: "Duration (min)" },
]

type Props = {
  daily: DailySummaryRow[]
  incidents: IncidentRow[]
  ridership: RidershipRow[]
  congestion: CongestionRow[]
}

function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
      Export CSV
    </Button>
  )
}

export function ReportsTabs({ daily, incidents, ridership, congestion }: Props) {
  return (
    <Tabs defaultValue="daily" className="gap-4">
      <TabsList>
        <TabsTrigger value="daily">Daily Summary</TabsTrigger>
        <TabsTrigger value="incidents">Incidents</TabsTrigger>
        <TabsTrigger value="ridership">Ridership</TabsTrigger>
        <TabsTrigger value="congestion">Congestion</TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {daily.length} day{daily.length === 1 ? "" : "s"} in current period
            </p>
            <ExportButton
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
              {incidents.length} incident{incidents.length === 1 ? "" : "s"} reported
            </p>
            <ExportButton
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
              {ridership.length} ridership entries
            </p>
            <ExportButton
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
              {congestion.length} congestion event{congestion.length === 1 ? "" : "s"}
            </p>
            <ExportButton
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
