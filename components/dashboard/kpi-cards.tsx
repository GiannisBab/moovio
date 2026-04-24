"use client"

import Link from "next/link"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
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
import { cn } from "@/lib/utils"

type Kpi = {
  key: "trips" | "vehicles" | "avgSpeed" | "co2Saved"
  title: string
  value: string
  delta: number
  icon: typeof Car01Icon
  spark: { v: number }[]
  color: string
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

function buildKpis(
  current: DailyTripsPoint[],
  previous: DailyTripsPoint[],
  spark: DailyTripsPoint[],
): Kpi[] {
  return [
    {
      key: "trips",
      title: "Total Trips",
      value: formatNumber(sum(current.map((d) => d.trips))),
      delta: deltaPct(sum(current.map((d) => d.trips)), sum(previous.map((d) => d.trips))),
      icon: Route01Icon,
      spark: spark.map((d) => ({ v: d.trips })),
      color: "var(--chart-1)",
    },
    {
      key: "vehicles",
      title: "Active Vehicles",
      value: formatNumber(Math.round(average(current.map((d) => d.vehicles)))),
      delta: deltaPct(
        average(current.map((d) => d.vehicles)),
        average(previous.map((d) => d.vehicles)),
      ),
      icon: Car01Icon,
      spark: spark.map((d) => ({ v: d.vehicles })),
      color: "var(--chart-2)",
    },
    {
      key: "avgSpeed",
      title: "Avg Speed",
      value: `${average(current.map((d) => d.avgSpeed)).toFixed(1)} km/h`,
      delta: deltaPct(
        average(current.map((d) => d.avgSpeed)),
        average(previous.map((d) => d.avgSpeed)),
      ),
      icon: DashboardSpeedIcon,
      spark: spark.map((d) => ({ v: d.avgSpeed })),
      color: "var(--chart-3)",
    },
    {
      key: "co2Saved",
      title: "CO₂ Saved",
      value: `${sum(current.map((d) => d.co2Saved)).toFixed(1)} t`,
      delta: deltaPct(
        sum(current.map((d) => d.co2Saved)),
        sum(previous.map((d) => d.co2Saved)),
      ),
      icon: Leaf01Icon,
      spark: spark.map((d) => ({ v: d.co2Saved })),
      color: "var(--chart-4)",
    },
  ]
}

export function KpiCards({
  current,
  previous,
  spark,
}: {
  current: DailyTripsPoint[]
  previous: DailyTripsPoint[]
  spark: DailyTripsPoint[]
}) {
  const kpis = buildKpis(current, previous, spark)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const positive = kpi.delta >= 0
        return (
          <Link
            key={kpi.key}
            href="/analytics"
            className="group/kpi block transition-transform duration-150 ease-out-quart hover:-translate-y-0.5"
          >
            <Card size="sm" className="h-full transition-shadow duration-150 ease-out-quart group-hover/kpi:shadow-md">
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
                <div className="text-2xl font-bold tabular-nums">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <HugeiconsIcon
                    icon={positive ? TradeUpIcon : TradeDownIcon}
                    className={cn(
                      "size-4",
                      positive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
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
                  <span className="text-muted-foreground">vs prev</span>
                </div>
                <div className="-mb-1 mt-3 h-9 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={kpi.spark}
                      margin={{ top: 1, bottom: 1, left: 0, right: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={`spark-${kpi.key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={kpi.color} stopOpacity={0.45} />
                          <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="v"
                        type="monotone"
                        stroke={kpi.color}
                        strokeWidth={1.5}
                        fill={`url(#spark-${kpi.key})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
