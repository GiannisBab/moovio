import type { ChartConfig } from "@/components/ui/chart"
import { REFERENCE_TODAY } from "@/lib/analytics-filter"
import { congestionReports } from "@/lib/data/reports-data"

// Traffic Flow (24h hourly snapshot — distinct from analytics' daily granularity)
export const trafficFlowData = [
  { hour: "00:00", vehicles: 1200, avgSpeed: 58 },
  { hour: "01:00", vehicles: 800, avgSpeed: 62 },
  { hour: "02:00", vehicles: 600, avgSpeed: 65 },
  { hour: "03:00", vehicles: 500, avgSpeed: 67 },
  { hour: "04:00", vehicles: 700, avgSpeed: 64 },
  { hour: "05:00", vehicles: 1500, avgSpeed: 55 },
  { hour: "06:00", vehicles: 4200, avgSpeed: 42 },
  { hour: "07:00", vehicles: 7800, avgSpeed: 30 },
  { hour: "08:00", vehicles: 9500, avgSpeed: 22 },
  { hour: "09:00", vehicles: 7200, avgSpeed: 28 },
  { hour: "10:00", vehicles: 5400, avgSpeed: 35 },
  { hour: "11:00", vehicles: 5100, avgSpeed: 36 },
  { hour: "12:00", vehicles: 6200, avgSpeed: 32 },
  { hour: "13:00", vehicles: 6000, avgSpeed: 33 },
  { hour: "14:00", vehicles: 5500, avgSpeed: 34 },
  { hour: "15:00", vehicles: 6100, avgSpeed: 31 },
  { hour: "16:00", vehicles: 7500, avgSpeed: 27 },
  { hour: "17:00", vehicles: 9200, avgSpeed: 21 },
  { hour: "18:00", vehicles: 8800, avgSpeed: 23 },
  { hour: "19:00", vehicles: 6500, avgSpeed: 30 },
  { hour: "20:00", vehicles: 4800, avgSpeed: 38 },
  { hour: "21:00", vehicles: 3200, avgSpeed: 45 },
  { hour: "22:00", vehicles: 2200, avgSpeed: 52 },
  { hour: "23:00", vehicles: 1600, avgSpeed: 56 },
]

type ChartLabelT = (key: string) => string

export function buildTrafficFlowChartConfig(t: ChartLabelT): ChartConfig {
  return {
    vehicles: { label: t("vehicles"), color: "var(--chart-1)" },
    avgSpeed: { label: t("avgSpeed"), color: "var(--chart-2)" },
  }
}

// Modal Split chart config — data is computed by consumer from analytics' modalSplitTrendData
export function buildModalSplitChartConfig(t: ChartLabelT): ChartConfig {
  return {
    percentage: { label: t("percentage") },
    Car: { label: t("car"), color: "var(--chart-1)" },
    Bus: { label: t("bus"), color: "var(--chart-2)" },
    Bike: { label: t("bike"), color: "var(--chart-3)" },
    Walk: { label: t("walk"), color: "var(--chart-4)" },
  }
}

// Ridership (weekly cycle by transit mode — distinct from analytics' top stations)
export const ridershipData = [
  { day: "Mon", bus: 45200, metro: 62100, tram: 18400 },
  { day: "Tue", bus: 47800, metro: 64500, tram: 19200 },
  { day: "Wed", bus: 46100, metro: 63200, tram: 18900 },
  { day: "Thu", bus: 48500, metro: 65800, tram: 19800 },
  { day: "Fri", bus: 51200, metro: 68400, tram: 21100 },
  { day: "Sat", bus: 32400, metro: 41200, tram: 14600 },
  { day: "Sun", bus: 24800, metro: 33500, tram: 11200 },
]

export function buildRidershipChartConfig(t: ChartLabelT): ChartConfig {
  return {
    bus: { label: t("bus"), color: "var(--chart-1)" },
    metro: { label: t("metro"), color: "var(--chart-2)" },
    tram: { label: t("tram"), color: "var(--chart-3)" },
  }
}

// Congestion Alerts — derived from the canonical congestionReports pool
export type CongestionAlert = {
  id: string
  location: string
  severity: "critical" | "warning" | "info"
  peakHour: string
  durationMin: number
  daysAgo: number
}

const SEVERITY_RANK: Record<CongestionAlert["severity"], number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

export const congestionAlerts: CongestionAlert[] = [...congestionReports]
  .sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  })
  .slice(0, 5)
  .map((r) => {
    const d = new Date(`${r.date}T00:00:00Z`)
    const diffMs = REFERENCE_TODAY.getTime() - d.getTime()
    const daysAgo = Math.round(diffMs / (1000 * 60 * 60 * 24))
    return {
      id: r.id,
      location: r.location,
      severity: r.severity,
      peakHour: r.peakHour,
      durationMin: r.durationMin,
      daysAgo,
    }
  })
