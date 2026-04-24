"use client"

import * as React from "react"

import {
  inRange,
  rangeDays,
  resolvePreset,
  type AnalyticsRange,
} from "@/lib/analytics-filter"
import {
  dailyTripsData,
  modalSplitTrendData,
} from "@/lib/data/analytics-data"
import { congestionAlerts } from "@/lib/data/dashboard-data"
import {
  TimeRangeSelector,
  type DashboardRange,
} from "@/components/dashboard/time-range-selector"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RightNowStrip } from "@/components/dashboard/right-now-strip"
import { TrafficFlowChart } from "@/components/dashboard/traffic-flow-chart"
import { ModalSplitChart } from "@/components/dashboard/modal-split-chart"
import { CongestionAlerts } from "@/components/dashboard/congestion-alerts"
import { RidershipChart } from "@/components/dashboard/ridership-chart"

const RANGE_TO_PRESET = {
  today: "24h",
  week: "7d",
  month: "30d",
} as const

const SPARK_DAYS = 30

function previousSlice(
  data: typeof dailyTripsData,
  current: typeof dailyTripsData,
  range: AnalyticsRange,
): typeof dailyTripsData {
  const days = rangeDays(range)
  const startIdx = data.findIndex((d) => d.date === current[0]?.date)
  if (startIdx <= 0) return []
  return data.slice(Math.max(0, startIdx - days), startIdx)
}

export function DashboardView() {
  const [rangeKey, setRangeKey] = React.useState<DashboardRange>("today")

  const range = React.useMemo(
    () => resolvePreset(RANGE_TO_PRESET[rangeKey]),
    [rangeKey],
  )

  const filteredTrips = React.useMemo(
    () => dailyTripsData.filter((d) => inRange(d.date, range)),
    [range],
  )
  const previousTrips = React.useMemo(
    () => previousSlice(dailyTripsData, filteredTrips, range),
    [filteredTrips, range],
  )
  const sparkTrips = React.useMemo(
    () => dailyTripsData.slice(-SPARK_DAYS),
    [],
  )
  const filteredModalSplit = React.useMemo(
    () => modalSplitTrendData.filter((d) => inRange(d.date, range)),
    [range],
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <WelcomeSection alerts={congestionAlerts} />
        <TimeRangeSelector value={rangeKey} onChange={setRangeKey} />
      </div>

      <RightNowStrip />

      <KpiCards
        current={filteredTrips}
        previous={previousTrips}
        spark={sparkTrips}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TrafficFlowChart className="lg:col-span-2" />
        <ModalSplitChart data={filteredModalSplit} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CongestionAlerts data={congestionAlerts} />
        <RidershipChart className="lg:col-span-2" />
      </div>
    </div>
  )
}
