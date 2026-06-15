"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  buildTripsForecastChartConfig,
  FORECAST_CUTOFF_DATE,
  type TripsForecastPoint,
} from "@/lib/data/predictions-data"
import { cn } from "@/lib/utils"

export function TripsForecastChart({
  data,
  className,
}: {
  data: TripsForecastPoint[]
  className?: string
}) {
  const t = useTranslations("TripsForecast")
  const tChart = useTranslations("PredictionsChart")
  const config = buildTripsForecastChartConfig(tChart)
  const tickInterval = Math.max(0, Math.floor(data.length / 8))

  const seriesLabels: Record<string, string> = {
    actual: t("legendActual"),
    predicted: t("legendPredicted"),
    band: t("legendBand"),
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[340px] w-full">
          <ComposedChart data={data} margin={{ left: 4, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="forecast-band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-band)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-band)" stopOpacity={0.05} />
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
                    const isFuture = payload?.[0]?.payload?.isFuture as boolean | undefined
                    if (!raw) return ""
                    const label = format(new Date(`${raw}T00:00:00Z`), "EEE, MMM d")
                    return isFuture ? `${label} · ${t("forecastBadge")}` : label
                  }}
                  formatter={(value, name) => {
                    if (value === null || value === undefined) return null
                    const key = name as string
                    const label = seriesLabels[key] ?? key
                    let display: string
                    if (key === "band" && Array.isArray(value)) {
                      const [lo, hi] = value as [number, number]
                      display = `${lo.toLocaleString("en-US")} – ${hi.toLocaleString("en-US")}`
                    } else if (typeof value === "number") {
                      display = value.toLocaleString("en-US")
                    } else {
                      return null
                    }
                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-2.5 rounded-[2px]"
                            style={{ backgroundColor: `var(--color-${key})` }}
                          />
                          <span className="text-muted-foreground">{label}</span>
                        </div>
                        <span className="font-mono font-medium tabular-nums">{display}</span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Area
              dataKey="band"
              type="monotone"
              stroke="none"
              fill="url(#forecast-band)"
              isAnimationActive={false}
              activeDot={false}
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              dataKey="predicted"
              type="monotone"
              stroke="var(--color-predicted)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <ReferenceLine
              x={FORECAST_CUTOFF_DATE}
              stroke="var(--muted-foreground)"
              strokeDasharray="2 4"
              label={{
                value: t("today"),
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-4 rounded-full"
              style={{ background: "var(--chart-3)" }}
            />
            {t("legendActual")}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-4 rounded-full"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--chart-2) 0 4px, transparent 4px 8px)",
              }}
            />
            {t("legendPredicted")}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-4 rounded-sm"
              style={{ background: "var(--chart-2)", opacity: 0.3 }}
            />
            {t("legendBand")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
