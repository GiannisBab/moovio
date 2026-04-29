"use client"

import { useTranslations } from "next-intl"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  congestionHeatmapData,
  heatmapDays,
} from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function intensityClass(value: number): string {
  if (value < 15) return "bg-chart-1/[0.06]"
  if (value < 30) return "bg-chart-1/15"
  if (value < 50) return "bg-chart-1/30"
  if (value < 70) return "bg-chart-1/50"
  if (value < 85) return "bg-chart-1/70"
  return "bg-chart-1/90"
}

export function CongestionHeatmap({ className }: { className?: string }) {
  const t = useTranslations("Heatmap")
  const tDays = useTranslations("Days")
  const grid = new Map<string, number>()
  for (const cell of congestionHeatmapData) {
    grid.set(`${cell.day}-${cell.hour}`, cell.congestion)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delay={120}>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-1">
                <div />
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="text-center text-[10px] text-muted-foreground"
                  >
                    {h % 3 === 0 ? `${h.toString().padStart(2, "0")}` : ""}
                  </div>
                ))}
                {heatmapDays.map((day) => (
                  <div key={day} className="contents">
                    <div className="flex items-center text-xs text-muted-foreground">
                      {tDays(day)}
                    </div>
                    {HOURS.map((h) => {
                      const v = grid.get(`${day}-${h}`) ?? 0
                      return (
                        <Tooltip key={h}>
                          <TooltipTrigger
                            render={
                              <div
                                className={cn(
                                  "h-6 rounded-sm transition-colors",
                                  intensityClass(v),
                                )}
                              />
                            }
                          />
                          <TooltipContent side="top">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {tDays(day)} · {h.toString().padStart(2, "0")}:00
                              </span>
                              <span className="text-background/70">
                                {t("congestion", { value: v })}
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                <span>{t("low")}</span>
                <div className="flex h-2 w-32 overflow-hidden rounded-sm">
                  <div className="flex-1 bg-chart-1/[0.06]" />
                  <div className="flex-1 bg-chart-1/15" />
                  <div className="flex-1 bg-chart-1/30" />
                  <div className="flex-1 bg-chart-1/50" />
                  <div className="flex-1 bg-chart-1/70" />
                  <div className="flex-1 bg-chart-1/90" />
                </div>
                <span>{t("high")}</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
