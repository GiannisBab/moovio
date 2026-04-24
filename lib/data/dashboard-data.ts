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

export const trafficFlowChartConfig = {
  vehicles: { label: "Vehicles", color: "var(--chart-1)" },
  avgSpeed: { label: "Avg Speed (km/h)", color: "var(--chart-2)" },
} satisfies ChartConfig

// Modal Split chart config — data is computed by consumer from analytics' modalSplitTrendData
export const modalSplitChartConfig = {
  percentage: { label: "Percentage" },
  Car: { label: "Car", color: "var(--chart-1)" },
  Bus: { label: "Bus", color: "var(--chart-2)" },
  Bike: { label: "Bike", color: "var(--chart-3)" },
  Walk: { label: "Walk", color: "var(--chart-4)" },
} satisfies ChartConfig

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

export const ridershipChartConfig = {
  bus: { label: "Bus", color: "var(--chart-1)" },
  metro: { label: "Metro", color: "var(--chart-2)" },
  tram: { label: "Tram", color: "var(--chart-3)" },
} satisfies ChartConfig

// Congestion Alerts — derived from the canonical congestionReports pool
export type CongestionAlert = {
  id: string
  location: string
  severity: "critical" | "warning" | "info"
  description: string
  time: string
}

function relativeTime(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const diffMs = REFERENCE_TODAY.getTime() - d.getTime()
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "1 week ago"
  return `${Math.floor(days / 7)} weeks ago`
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
  .map((r) => ({
    id: r.id,
    location: r.location,
    severity: r.severity,
    description: `Peak congestion at ${r.peakHour} · sustained for ${r.durationMin} min`,
    time: relativeTime(r.date),
  }))
