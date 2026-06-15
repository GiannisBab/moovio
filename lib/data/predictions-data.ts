import type { ChartConfig } from "@/components/ui/chart"
import predictionsPayload from "./predictions.json"

const REFERENCE_DATE = new Date("2026-04-24T00:00:00Z")

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export type TripsForecastPoint = {
  date: string
  actual: number | null
  predicted: number
  band: [number, number]
  isFuture: boolean
}

export const tripsForecastData: TripsForecastPoint[] = predictionsPayload.tripsForecastData.map(
  (p) => ({
    date: p.date,
    actual: p.actual,
    predicted: p.predicted,
    band: [p.band[0], p.band[1]],
    isFuture: p.isFuture,
  }),
)

export const FORECAST_CUTOFF_DATE = isoDate(REFERENCE_DATE)

export type ModalForecastPoint = {
  date: string
  car: number
  bus: number
  bike: number
  walk: number
  isFuture: boolean
}

export const modalForecastData: ModalForecastPoint[] = predictionsPayload.modalForecastData.map(
  (p) => ({
    date: p.date,
    car: p.car,
    bus: p.bus,
    bike: p.bike,
    walk: p.walk,
    isFuture: p.isFuture,
  }),
)

export type AnomalyEntry = {
  id: string
  location: string
  metric: "ridership" | "speed" | "congestion"
  observed: number
  expected: number
  unit: string
  zScore: number
  severity: "high" | "medium" | "low"
}

export const anomalyEntries: AnomalyEntry[] = predictionsPayload.anomalyEntries.map((e) => ({
  id: e.id,
  location: e.location,
  metric: e.metric as AnomalyEntry["metric"],
  observed: e.observed,
  expected: e.expected,
  unit: e.unit,
  zScore: e.zScore,
  severity: e.severity as AnomalyEntry["severity"],
}))

export type ModelMetadata = {
  algorithm: string
  trainedOn: string
  trainingWindowDays: number
  horizonDays: number
  mape: number
  rmse: number
  lastUpdated: string
}

export const modelMetadata: ModelMetadata = predictionsPayload.modelMetadata

export type PredictionsKpi = {
  predictedPeakDay: { date: string; trips: number }
  predictedTomorrowTrips: number
  predictedTomorrowDelta: number
  modelAccuracy: number
  anomalies: number
}

export const predictionsKpi: PredictionsKpi = (() => {
  const future = tripsForecastData.filter((p) => p.isFuture)
  const peak = future.reduce((acc, p) => (p.predicted > acc.predicted ? p : acc), future[0])
  const tomorrow = future[0]
  const lastActual = tripsForecastData
    .filter((p) => p.actual !== null)
    .slice(-1)[0]
  const delta =
    lastActual && lastActual.actual
      ? ((tomorrow.predicted - lastActual.actual) / lastActual.actual) * 100
      : 0
  return {
    predictedPeakDay: { date: peak.date, trips: peak.predicted },
    predictedTomorrowTrips: tomorrow.predicted,
    predictedTomorrowDelta: Number(delta.toFixed(1)),
    modelAccuracy: 100 - modelMetadata.mape,
    anomalies: anomalyEntries.length,
  }
})()

type ChartLabelT = (key: string) => string

export function buildTripsForecastChartConfig(t: ChartLabelT): ChartConfig {
  return {
    actual: { label: t("actual"), color: "var(--chart-3)" },
    predicted: { label: t("predicted"), color: "var(--chart-2)" },
    band: { label: t("confidence"), color: "var(--chart-2)" },
  }
}

export function buildModalForecastChartConfig(t: ChartLabelT): ChartConfig {
  return {
    car: { label: t("car"), color: "var(--chart-1)" },
    bus: { label: t("bus"), color: "var(--chart-2)" },
    bike: { label: t("bike"), color: "var(--chart-3)" },
    walk: { label: t("walk"), color: "var(--chart-4)" },
  }
}
