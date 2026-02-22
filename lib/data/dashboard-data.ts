import type { ChartConfig } from "@/components/ui/chart"

// KPI Data
export type KpiItem = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: "Route" | "Car" | "Gauge" | "Leaf"
}

export const kpiData: KpiItem[] = [
  {
    title: "Total Trips Today",
    value: "284,391",
    change: "+12.5%",
    changeType: "positive",
    icon: "Route",
  },
  {
    title: "Active Vehicles",
    value: "12,847",
    change: "+3.2%",
    changeType: "positive",
    icon: "Car",
  },
  {
    title: "Avg Speed",
    value: "34.2 km/h",
    change: "-2.1%",
    changeType: "negative",
    icon: "Gauge",
  },
  {
    title: "CO2 Saved",
    value: "18.4 tons",
    change: "+8.7%",
    changeType: "positive",
    icon: "Leaf",
  },
]

// Traffic Flow (hourly)
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

// Modal Split
export const modalSplitData = [
  { mode: "Car", percentage: 45, fill: "var(--chart-1)" },
  { mode: "Bus", percentage: 25, fill: "var(--chart-2)" },
  { mode: "Bike", percentage: 18, fill: "var(--chart-3)" },
  { mode: "Walk", percentage: 12, fill: "var(--chart-4)" },
]

export const modalSplitChartConfig = {
  percentage: { label: "Percentage" },
  Car: { label: "Car", color: "var(--chart-1)" },
  Bus: { label: "Bus", color: "var(--chart-2)" },
  Bike: { label: "Bike", color: "var(--chart-3)" },
  Walk: { label: "Walk", color: "var(--chart-4)" },
} satisfies ChartConfig

// Congestion Alerts
export type CongestionAlert = {
  id: string
  location: string
  severity: "critical" | "warning" | "info"
  description: string
  time: string
}

export const congestionAlerts: CongestionAlert[] = [
  {
    id: "1",
    location: "Highway A1 — Northbound",
    severity: "critical",
    description: "Major accident, 3 lanes blocked. Expect 45min delay.",
    time: "2 min ago",
  },
  {
    id: "2",
    location: "Main St & 5th Ave",
    severity: "warning",
    description: "Construction zone reducing traffic to single lane.",
    time: "15 min ago",
  },
  {
    id: "3",
    location: "Central Station Area",
    severity: "warning",
    description: "Unusual congestion due to event at nearby stadium.",
    time: "28 min ago",
  },
  {
    id: "4",
    location: "Ring Road — Eastbound",
    severity: "info",
    description: "Moderate traffic buildup, clearing gradually.",
    time: "42 min ago",
  },
  {
    id: "5",
    location: "Industrial Park Rd",
    severity: "info",
    description: "Scheduled road maintenance, minor delays expected.",
    time: "1 hr ago",
  },
]

// Ridership Trends (weekly)
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
