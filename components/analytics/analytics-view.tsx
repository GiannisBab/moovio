"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  DEFAULT_FILTER,
  inRange,
  rangeDays,
  type AnalyticsFilter,
} from "@/lib/analytics-filter"
import {
  dailyTripsData,
  modalSplitTrendData,
} from "@/lib/data/analytics-data"
import { exportToCsv } from "@/lib/csv"
import { AnalyticsToolbar } from "@/components/analytics/analytics-toolbar"
import { AnalyticsKpis } from "@/components/analytics/analytics-kpis"
import { TripsTrendChart } from "@/components/analytics/trips-trend-chart"
import { ModalSplitTrendChart } from "@/components/analytics/modal-split-trend-chart"
import { CongestionHeatmap } from "@/components/analytics/congestion-heatmap"
import { RoutePerformanceTable } from "@/components/analytics/route-performance-table"
import { TopStationsChart } from "@/components/analytics/top-stations-chart"

export function AnalyticsView() {
  const t = useTranslations("Analytics")
  const [filter, setFilter] = React.useState<AnalyticsFilter>(DEFAULT_FILTER)

  const filteredTrips = React.useMemo(
    () => dailyTripsData.filter((d) => inRange(d.date, filter.range)),
    [filter.range],
  )

  const previousTrips = React.useMemo(() => {
    const days = rangeDays(filter.range)
    const startIdx = dailyTripsData.findIndex(
      (d) => d.date === filteredTrips[0]?.date,
    )
    if (startIdx <= 0) return []
    return dailyTripsData.slice(Math.max(0, startIdx - days), startIdx)
  }, [filter.range, filteredTrips])

  const filteredModalSplit = React.useMemo(
    () => modalSplitTrendData.filter((d) => inRange(d.date, filter.range)),
    [filter.range],
  )

  const handleExport = () => {
    exportToCsv(
      `moovio-trips-${filter.range.from.toISOString().slice(0, 10)}-to-${filter.range.to
        .toISOString()
        .slice(0, 10)}`,
      [
        { key: "date", header: t("csvDate") },
        { key: "trips", header: t("csvTrips") },
        { key: "vehicles", header: t("csvVehicles") },
        { key: "avgSpeed", header: t("csvAvgSpeed") },
        { key: "co2Saved", header: t("csvCo2") },
      ],
      filteredTrips,
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <AnalyticsToolbar
          value={filter}
          onChange={setFilter}
          onExport={handleExport}
          exportLabel={t("exportCsv")}
        />
      </div>

      <AnalyticsKpis current={filteredTrips} previous={previousTrips} />

      <div className="grid gap-6 lg:grid-cols-3">
        <TripsTrendChart data={filteredTrips} className="lg:col-span-2" />
        <TopStationsChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ModalSplitTrendChart
          data={filteredModalSplit}
          className="lg:col-span-2"
        />
        <RoutePerformanceTable />
      </div>

      <CongestionHeatmap />
    </div>
  )
}
