"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  buildDailyTripsChartConfig,
  type DailyTripsPoint,
} from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

export function TripsTrendChart({
  data,
  className,
}: {
  data: DailyTripsPoint[]
  className?: string
}) {
  const tickInterval = Math.max(0, Math.floor(data.length / 8))
  const t = useTranslations("TripsTrend")
  const tChart = useTranslations("ChartLabels")
  const dailyTripsChartConfig = buildDailyTripsChartConfig(tChart)

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dailyTripsChartConfig}
          className="h-[320px] w-full"
        >
          <AreaChart data={data} margin={{ left: 4, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="trips-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-trips)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-trips)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="vehicles-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-vehicles)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-vehicles)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={tickInterval}
              tickFormatter={(v: string) => format(new Date(`${v}T00:00:00Z`), "MMM d")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const raw = payload?.[0]?.payload?.date as string | undefined
                    return raw ? format(new Date(`${raw}T00:00:00Z`), "EEE, MMM d") : ""
                  }}
                />
              }
            />
            <Area
              dataKey="trips"
              type="monotone"
              stroke="var(--color-trips)"
              fill="url(#trips-fill)"
              strokeWidth={2}
            />
            <Area
              dataKey="vehicles"
              type="monotone"
              stroke="var(--color-vehicles)"
              fill="url(#vehicles-fill)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
