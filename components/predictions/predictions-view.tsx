"use client"

import { useTranslations } from "next-intl"

import { PredictionsKpis } from "@/components/predictions/predictions-kpis"
import { TripsForecastChart } from "@/components/predictions/trips-forecast-chart"
import { ModalForecastChart } from "@/components/predictions/modal-forecast-chart"
import { AnomalyWatchlist } from "@/components/predictions/anomaly-watchlist"
import { ModelMetaCard } from "@/components/predictions/model-meta-card"
import {
  anomalyEntries,
  modalForecastData,
  modelMetadata,
  predictionsKpi,
  tripsForecastData,
} from "@/lib/data/predictions-data"
import { Badge } from "@/components/ui/badge"

export function PredictionsView() {
  const t = useTranslations("Predictions")

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
            <Badge variant="secondary">{t("modelBadge")}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <PredictionsKpis data={predictionsKpi} />

      <div className="grid gap-6 lg:grid-cols-3">
        <TripsForecastChart data={tripsForecastData} className="lg:col-span-2" />
        <AnomalyWatchlist data={anomalyEntries} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ModalForecastChart data={modalForecastData} className="lg:col-span-2" />
        <ModelMetaCard data={modelMetadata} />
      </div>
    </div>
  )
}
