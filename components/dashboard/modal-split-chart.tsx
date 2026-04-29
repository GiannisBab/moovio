"use client"

import { Pie, PieChart, Label } from "recharts"
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
import { buildModalSplitChartConfig } from "@/lib/data/dashboard-data"
import type { ModalSplitPoint } from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

type Slice = { mode: string; percentage: number; fill: string }

function average(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
}

function buildSlices(
  data: ModalSplitPoint[],
  labels: { car: string; bus: string; bike: string; walk: string },
): Slice[] {
  return [
    { mode: labels.car, percentage: average(data.map((d) => d.car)), fill: "var(--chart-1)" },
    { mode: labels.bus, percentage: average(data.map((d) => d.bus)), fill: "var(--chart-2)" },
    { mode: labels.bike, percentage: average(data.map((d) => d.bike)), fill: "var(--chart-3)" },
    { mode: labels.walk, percentage: average(data.map((d) => d.walk)), fill: "var(--chart-4)" },
  ]
}

export function ModalSplitChart({
  data,
  className,
}: {
  data: ModalSplitPoint[]
  className?: string
}) {
  const t = useTranslations("ModalSplit")
  const tChart = useTranslations("ChartLabels")
  const slices = buildSlices(data, {
    car: t("car"),
    bus: t("bus"),
    bike: t("bike"),
    walk: t("walk"),
  })
  const modalSplitChartConfig = buildModalSplitChartConfig(tChart)

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={modalSplitChartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={slices}
              dataKey="percentage"
              nameKey="mode"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          100%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {t("ofTrips")}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="mode" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
