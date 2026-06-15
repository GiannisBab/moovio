"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type AnomalyEntry } from "@/lib/data/predictions-data"
import { cn } from "@/lib/utils"

const SEVERITY_VARIANT: Record<
  AnomalyEntry["severity"],
  "destructive" | "secondary" | "outline"
> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
}

function formatValue(entry: AnomalyEntry, value: number): string {
  if (entry.metric === "ridership") {
    return `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${entry.unit}`
  }
  if (entry.metric === "speed") {
    return `${value.toFixed(1)} ${entry.unit}`
  }
  return `${Math.round(value)}${entry.unit}`
}

export function AnomalyWatchlist({
  data,
  className,
}: {
  data: AnomalyEntry[]
  className?: string
}) {
  const t = useTranslations("AnomalyWatchlist")
  const tMetric = useTranslations("AnomalyMetric")
  const tSeverity = useTranslations("AnomalySeverity")

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {data.map((entry) => {
            const delta = ((entry.observed - entry.expected) / entry.expected) * 100
            const drop = delta < 0
            return (
              <li
                key={entry.id}
                className="flex items-start gap-3 rounded-lg border bg-card p-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <HugeiconsIcon icon={Alert02Icon} className="size-4 text-muted-foreground" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {entry.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tMetric(entry.metric)}
                      </div>
                    </div>
                    <Badge variant={SEVERITY_VARIANT[entry.severity]}>
                      {tSeverity(entry.severity)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <HugeiconsIcon
                      icon={drop ? TradeDownIcon : TradeUpIcon}
                      className={
                        drop
                          ? "size-3.5 text-red-600 dark:text-red-400"
                          : "size-3.5 text-emerald-600 dark:text-emerald-400"
                      }
                    />
                    <span
                      className={
                        drop
                          ? "font-medium text-red-600 dark:text-red-400"
                          : "font-medium text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {drop ? "" : "+"}
                      {delta.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      {t("observedVsExpected", {
                        observed: formatValue(entry, entry.observed),
                        expected: formatValue(entry, entry.expected),
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    z = {entry.zScore >= 0 ? "+" : ""}
                    {entry.zScore.toFixed(2)}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
