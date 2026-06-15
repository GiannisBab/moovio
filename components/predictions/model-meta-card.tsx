"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { AiBrain01Icon } from "@hugeicons/core-free-icons"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { type ModelMetadata } from "@/lib/data/predictions-data"
import { cn } from "@/lib/utils"

export function ModelMetaCard({
  data,
  className,
}: {
  data: ModelMetadata
  className?: string
}) {
  const t = useTranslations("ModelMeta")

  const rows: { label: string; value: string }[] = [
    { label: t("algorithm"), value: data.algorithm },
    { label: t("trainingData"), value: data.trainedOn },
    {
      label: t("trainingWindow"),
      value: t("days", { count: data.trainingWindowDays }),
    },
    { label: t("horizon"), value: t("days", { count: data.horizonDays }) },
    { label: t("mape"), value: `${data.mape.toFixed(2)}%` },
    {
      label: t("rmse"),
      value: data.rmse.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    },
    {
      label: t("lastUpdated"),
      value: format(new Date(`${data.lastUpdated}T00:00:00Z`), "MMM d, yyyy"),
    },
  ]

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <HugeiconsIcon icon={AiBrain01Icon} className="size-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="text-right font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
