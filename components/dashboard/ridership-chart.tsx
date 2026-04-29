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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ridershipData, buildRidershipChartConfig } from "@/lib/data/dashboard-data"
import { cn } from "@/lib/utils"

export function RidershipChart({ className }: { className?: string }) {
  const t = useTranslations("Ridership")
  const tChart = useTranslations("ChartLabels")
  const tDays = useTranslations("Days")
  const ridershipChartConfig = buildRidershipChartConfig(tChart)
  const data = ridershipData.map((d) => ({ ...d, dayLabel: tDays(d.day as "Mon") }))
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ridershipChartConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="bus"
              fill="var(--color-bus)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="metro"
              fill="var(--color-metro)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="tram"
              fill="var(--color-tram)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
