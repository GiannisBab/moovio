"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  trafficFlowData,
  buildTrafficFlowChartConfig,
} from "@/lib/data/dashboard-data"
import { cn } from "@/lib/utils"

export function TrafficFlowChart({ className }: { className?: string }) {
  const t = useTranslations("TrafficFlow")
  const tChart = useTranslations("ChartLabels")
  const trafficFlowChartConfig = buildTrafficFlowChartConfig(tChart)
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trafficFlowChartConfig} className="h-[300px] w-full">
          <AreaChart data={trafficFlowData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
              interval={2}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="vehicles"
              type="natural"
              fill="var(--color-vehicles)"
              stroke="var(--color-vehicles)"
              fillOpacity={0.3}
            />
            <Area
              dataKey="avgSpeed"
              type="natural"
              fill="var(--color-avgSpeed)"
              stroke="var(--color-avgSpeed)"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
