"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  buildTopStationsChartConfig,
  topStationsData,
} from "@/lib/data/analytics-data"
import { useDataLabel } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export function TopStationsChart({ className }: { className?: string }) {
  const t = useTranslations("TopStations")
  const tChart = useTranslations("ChartLabels")
  const dl = useDataLabel()
  const topStationsChartConfig = buildTopStationsChartConfig(tChart)
  const sorted = [...topStationsData]
    .sort((a, b) => b.ridership - a.ridership)
    .map((s) => ({ ...s, name: dl(s.name) }))

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={topStationsChartConfig}
          className="h-[320px] w-full"
        >
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ left: 12, right: 24, top: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={120}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="ridership"
              fill="var(--color-ridership)"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
