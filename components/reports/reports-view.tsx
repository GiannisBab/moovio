"use client"

import * as React from "react"

import {
  DEFAULT_FILTER,
  inRange,
  type AnalyticsFilter,
} from "@/lib/analytics-filter"
import {
  congestionReports,
  dailySummaryReports,
  incidentReports,
  ridershipReports,
} from "@/lib/data/reports-data"
import { AnalyticsToolbar } from "@/components/analytics/analytics-toolbar"
import { ReportsKpis } from "@/components/reports/reports-kpis"
import { ReportsTabs } from "@/components/reports/reports-tabs"

export function ReportsView() {
  const [filter, setFilter] = React.useState<AnalyticsFilter>(DEFAULT_FILTER)

  const filteredDaily = React.useMemo(
    () => dailySummaryReports.filter((r) => inRange(r.date, filter.range)),
    [filter.range],
  )
  const filteredIncidents = React.useMemo(
    () =>
      incidentReports.filter((r) => inRange(r.date.slice(0, 10), filter.range)),
    [filter.range],
  )
  const filteredRidership = React.useMemo(
    () => ridershipReports.filter((r) => inRange(r.date, filter.range)),
    [filter.range],
  )
  const filteredCongestion = React.useMemo(
    () => congestionReports.filter((r) => inRange(r.date, filter.range)),
    [filter.range],
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Browse, sort, and export tabular records for the selected period
          </p>
        </div>
        <AnalyticsToolbar value={filter} onChange={setFilter} />
      </div>

      <ReportsKpis
        daily={filteredDaily}
        incidents={filteredIncidents}
        ridership={filteredRidership}
        congestion={filteredCongestion}
      />

      <ReportsTabs
        daily={filteredDaily}
        incidents={filteredIncidents}
        ridership={filteredRidership}
        congestion={filteredCongestion}
      />
    </div>
  )
}
