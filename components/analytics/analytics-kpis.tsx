"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import {
  Car01Icon,
  DashboardSpeedIcon,
  Leaf01Icon,
  Route01Icon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import type { DailyTripsPoint } from "@/lib/data/analytics-data"

type KpiTitleKey = "totalTrips" | "activeVehicles" | "avgSpeed" | "co2Saved"

type Kpi = {
  titleKey: KpiTitleKey
  value: string
  delta: number
  icon: typeof Car01Icon
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

function average(values: number[]): number {
  return values.length ? sum(values) / values.length : 0
}

function deltaPct(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function AnalyticsKpis({
  current,
  previous,
}: {
  current: DailyTripsPoint[]
  previous: DailyTripsPoint[]
}) {
  const t = useTranslations("AnalyticsKpi")
  const kpis: Kpi[] = [
    {
      titleKey: "totalTrips",
      value: formatNumber(sum(current.map((d) => d.trips))),
      delta: deltaPct(
        sum(current.map((d) => d.trips)),
        sum(previous.map((d) => d.trips)),
      ),
      icon: Route01Icon,
    },
    {
      titleKey: "activeVehicles",
      value: formatNumber(Math.round(average(current.map((d) => d.vehicles)))),
      delta: deltaPct(
        average(current.map((d) => d.vehicles)),
        average(previous.map((d) => d.vehicles)),
      ),
      icon: Car01Icon,
    },
    {
      titleKey: "avgSpeed",
      value: `${average(current.map((d) => d.avgSpeed)).toFixed(1)} km/h`,
      delta: deltaPct(
        average(current.map((d) => d.avgSpeed)),
        average(previous.map((d) => d.avgSpeed)),
      ),
      icon: DashboardSpeedIcon,
    },
    {
      titleKey: "co2Saved",
      value: `${sum(current.map((d) => d.co2Saved)).toFixed(1)} t`,
      delta: deltaPct(
        sum(current.map((d) => d.co2Saved)),
        sum(previous.map((d) => d.co2Saved)),
      ),
      icon: Leaf01Icon,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const positive = kpi.delta >= 0
        return (
          <Card key={kpi.titleKey} size="sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(kpi.titleKey)}
              </CardTitle>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={kpi.icon} className="size-4 text-muted-foreground" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <HugeiconsIcon
                  icon={positive ? TradeUpIcon : TradeDownIcon}
                  className={
                    positive
                      ? "size-4 text-emerald-600 dark:text-emerald-400"
                      : "size-4 text-red-600 dark:text-red-400"
                  }
                />
                <span
                  className={
                    positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {positive ? "+" : ""}
                  {kpi.delta.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">{t("vsPrev")}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
