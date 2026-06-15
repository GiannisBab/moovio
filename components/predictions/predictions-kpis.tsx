"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import {
  AiBrain01Icon,
  Alert02Icon,
  ChartLineData01Icon,
  Route01Icon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"
import { format } from "date-fns"

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import type { PredictionsKpi } from "@/lib/data/predictions-data"

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

export function PredictionsKpis({ data }: { data: PredictionsKpi }) {
  const t = useTranslations("PredictionsKpi")
  const positive = data.predictedTomorrowDelta >= 0

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("tomorrowTrips")}
          </CardTitle>
          <CardAction>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={Route01Icon} className="size-4 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(data.predictedTomorrowTrips)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <HugeiconsIcon
              icon={positive ? TradeUpIcon : TradeDownIcon}
              className={
                positive
                  ? "size-4 text-emerald-600 dark:text-emerald-400"
                  : "size-4 text-red-600 dark:text-red-400"
              }
            />
            <span
              className={
                positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {positive ? "+" : ""}
              {data.predictedTomorrowDelta.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">{t("vsToday")}</span>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("peakDay")}
          </CardTitle>
          <CardAction>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={ChartLineData01Icon} className="size-4 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(new Date(`${data.predictedPeakDay.date}T00:00:00Z`), "EEE, MMM d")}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("peakDayHint", { trips: formatNumber(data.predictedPeakDay.trips) })}
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("modelAccuracy")}
          </CardTitle>
          <CardAction>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={AiBrain01Icon} className="size-4 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.modelAccuracy.toFixed(1)}%</div>
          <p className="mt-1 text-xs text-muted-foreground">{t("accuracyHint")}</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("anomalies")}
          </CardTitle>
          <CardAction>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={Alert02Icon} className="size-4 text-muted-foreground" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.anomalies}</div>
          <p className="mt-1 text-xs text-muted-foreground">{t("anomaliesHint")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
