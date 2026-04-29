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
  buildModalSplitTrendChartConfig,
  type ModalSplitPoint,
} from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

export function ModalSplitTrendChart({
  data,
  className,
}: {
  data: ModalSplitPoint[]
  className?: string
}) {
  const tickInterval = Math.max(0, Math.floor(data.length / 6))
  const t = useTranslations("ModalSplitTrend")
  const tModes = useTranslations("ModalSplit")
  const tChart = useTranslations("ChartLabels")
  const modalSplitTrendChartConfig = buildModalSplitTrendChartConfig(tChart)
  const modeLabels: Record<string, string> = {
    car: tModes("car"),
    bus: tModes("bus"),
    bike: tModes("bike"),
    walk: tModes("walk"),
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={modalSplitTrendChartConfig}
          className="h-[320px] w-full"
        >
          <AreaChart data={data} stackOffset="expand" margin={{ left: 4, right: 4, top: 4 }}>
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
              tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const raw = payload?.[0]?.payload?.date as string | undefined
                    return raw ? format(new Date(`${raw}T00:00:00Z`), "EEE, MMM d") : ""
                  }}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-[2px]"
                          style={{
                            backgroundColor: `var(--color-${name as string})`,
                          }}
                        />
                        <span className="text-muted-foreground">
                          {modeLabels[name as string] ?? (name as string)}
                        </span>
                      </div>
                      <span className="font-mono font-medium tabular-nums">
                        {(value as number).toFixed(1)}%
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="car"
              type="monotone"
              stackId="1"
              stroke="var(--color-car)"
              fill="var(--color-car)"
              fillOpacity={0.65}
            />
            <Area
              dataKey="bus"
              type="monotone"
              stackId="1"
              stroke="var(--color-bus)"
              fill="var(--color-bus)"
              fillOpacity={0.65}
            />
            <Area
              dataKey="bike"
              type="monotone"
              stackId="1"
              stroke="var(--color-bike)"
              fill="var(--color-bike)"
              fillOpacity={0.65}
            />
            <Area
              dataKey="walk"
              type="monotone"
              stackId="1"
              stroke="var(--color-walk)"
              fill="var(--color-walk)"
              fillOpacity={0.65}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
