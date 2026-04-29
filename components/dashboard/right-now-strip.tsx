"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  AlertCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"

import { Card, CardContent } from "@/components/ui/card"
import { REFERENCE_TODAY } from "@/lib/analytics-filter"
import {
  congestionHeatmapData,
  heatmapDays,
} from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

const FALLBACK_HOUR = 14

type LoadTone = "ok" | "moderate" | "high"
type LoadKey = "heavy" | "moderate" | "light"

function loadLevel(value: number): { key: LoadKey; tone: LoadTone } {
  if (value >= 70) return { key: "heavy", tone: "high" }
  if (value >= 40) return { key: "moderate", tone: "moderate" }
  return { key: "light", tone: "ok" }
}

const TONE_DOT: Record<"ok" | "moderate" | "high", string> = {
  ok: "bg-emerald-500",
  moderate: "bg-amber-500",
  high: "bg-red-500",
}

const TONE_BG: Record<"ok" | "moderate" | "high", string> = {
  ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  moderate: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function RightNowStrip() {
  const t = useTranslations("RightNow")
  const tDays = useTranslations("Days")
  const [hour, setHour] = React.useState<number>(FALLBACK_HOUR)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setHour(new Date().getHours())
    setMounted(true)
  }, [])

  const dayIdx = ((REFERENCE_TODAY.getUTCDay() + 6) % 7)
  const day = heatmapDays[dayIdx]

  const todayCells = React.useMemo(
    () => congestionHeatmapData.filter((c) => c.day === day),
    [day],
  )
  const currentCell = todayCells.find((c) => c.hour === hour)
  const current = currentCell?.congestion ?? 0
  const level = loadLevel(current)

  const upcoming = todayCells
    .filter((c) => c.hour > hour && c.congestion >= 65)
    .sort((a, b) => a.hour - b.hour)[0]
  const upcomingDelta = upcoming ? upcoming.hour - hour : null

  const dayPeak = [...todayCells].sort(
    (a, b) => b.congestion - a.congestion,
  )[0]

  return (
    <Card size="sm" className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <HugeiconsIcon icon={Activity01Icon} className="size-4 text-muted-foreground" />
            <span className="absolute right-1 top-1 flex size-2">
              <span
                className={cn(
                  "absolute inset-0 rounded-full opacity-60",
                  TONE_DOT[level.tone],
                  mounted && "animate-ping",
                )}
              />
              <span className={cn("relative size-2 rounded-full", TONE_DOT[level.tone])} />
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t("rightNow")}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  TONE_BG[level.tone],
                )}
              >
                {t(level.key)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("networkLoad", {
                value: current,
                day: tDays(day),
                time: `${String(hour).padStart(2, "0")}:00`,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:justify-end">
          {upcoming && upcomingDelta !== null && upcomingDelta > 0 && (
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 text-amber-500" />
              {t("nextPeak", { hours: upcomingDelta })}
              <span className="text-foreground/80">({upcoming.congestion}%)</span>
            </span>
          )}
          {dayPeak && (
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              {t("dayPeak", { time: `${String(dayPeak.hour).padStart(2, "0")}:00` })}
              <span className="text-foreground/80">({dayPeak.congestion}%)</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
