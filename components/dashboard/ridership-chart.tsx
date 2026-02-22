"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { ridershipData, ridershipChartConfig } from "@/lib/data/dashboard-data"
import { cn } from "@/lib/utils"

export function RidershipChart({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Ridership Trends</CardTitle>
        <CardDescription>Weekly public transport usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ridershipChartConfig} className="h-[300px] w-full">
          <BarChart data={ridershipData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
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
