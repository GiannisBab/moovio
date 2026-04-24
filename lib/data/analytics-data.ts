import type { ChartConfig } from "@/components/ui/chart"

const REFERENCE_DATE = new Date("2026-04-24T00:00:00Z")

function seededRandom(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

const ANALYTICS_DAYS = 90

export type DailyTripsPoint = {
  date: string
  trips: number
  vehicles: number
  avgSpeed: number
  co2Saved: number
}

export const dailyTripsData: DailyTripsPoint[] = (() => {
  const rand = seededRandom(42)
  const points: DailyTripsPoint[] = []
  for (let i = ANALYTICS_DAYS - 1; i >= 0; i--) {
    const d = addDays(REFERENCE_DATE, -i)
    const dow = d.getUTCDay()
    const isWeekend = dow === 0 || dow === 6
    const trend = 1 + ((ANALYTICS_DAYS - i) / ANALYTICS_DAYS) * 0.18
    const weekendFactor = isWeekend ? 0.62 : 1
    const noise = 0.9 + rand() * 0.2
    const trips = Math.round(280_000 * trend * weekendFactor * noise)
    const vehicles = Math.round(12_500 * trend * weekendFactor * (0.95 + rand() * 0.1))
    const avgSpeed = Number((34 + (isWeekend ? 6 : 0) + (rand() - 0.5) * 4).toFixed(1))
    const co2Saved = Number((18 * trend * weekendFactor * (0.9 + rand() * 0.2)).toFixed(1))
    points.push({ date: isoDate(d), trips, vehicles, avgSpeed, co2Saved })
  }
  return points
})()

export const dailyTripsChartConfig = {
  trips: { label: "Trips", color: "var(--chart-1)" },
  vehicles: { label: "Vehicles", color: "var(--chart-2)" },
} satisfies ChartConfig

export type ModalSplitPoint = {
  date: string
  car: number
  bus: number
  bike: number
  walk: number
}

export const modalSplitTrendData: ModalSplitPoint[] = (() => {
  const rand = seededRandom(1337)
  const points: ModalSplitPoint[] = []
  for (let i = ANALYTICS_DAYS - 1; i >= 0; i--) {
    const d = addDays(REFERENCE_DATE, -i)
    const progress = (ANALYTICS_DAYS - i) / ANALYTICS_DAYS
    const car = 47 - progress * 4 + (rand() - 0.5) * 2
    const bus = 24 + progress * 1.5 + (rand() - 0.5) * 1.5
    const bike = 17 + progress * 2 + (rand() - 0.5) * 1.2
    const walk = 100 - car - bus - bike
    points.push({
      date: isoDate(d),
      car: Number(car.toFixed(1)),
      bus: Number(bus.toFixed(1)),
      bike: Number(bike.toFixed(1)),
      walk: Number(walk.toFixed(1)),
    })
  }
  return points
})()

export const modalSplitTrendChartConfig = {
  car: { label: "Car", color: "var(--chart-1)" },
  bus: { label: "Bus", color: "var(--chart-2)" },
  bike: { label: "Bike", color: "var(--chart-3)" },
  walk: { label: "Walk", color: "var(--chart-4)" },
} satisfies ChartConfig

export type RoutePerformance = {
  id: string
  name: string
  trips: number
  avgSpeed: number
  delayMin: number
  congestionScore: number
}

export const routePerformanceData: RoutePerformance[] = [
  { id: "r1", name: "Highway A1 — Northbound", trips: 48_210, avgSpeed: 62.3, delayMin: 3.2, congestionScore: 28 },
  { id: "r2", name: "Highway A1 — Southbound", trips: 46_890, avgSpeed: 58.1, delayMin: 4.5, congestionScore: 34 },
  { id: "r3", name: "Ring Road — East", trips: 38_540, avgSpeed: 51.7, delayMin: 6.8, congestionScore: 47 },
  { id: "r4", name: "Ring Road — West", trips: 36_120, avgSpeed: 54.2, delayMin: 5.4, congestionScore: 41 },
  { id: "r5", name: "Main St Corridor", trips: 31_780, avgSpeed: 28.4, delayMin: 11.2, congestionScore: 72 },
  { id: "r6", name: "Central Ave", trips: 27_340, avgSpeed: 24.8, delayMin: 14.6, congestionScore: 81 },
  { id: "r7", name: "Industrial Park Rd", trips: 18_920, avgSpeed: 41.5, delayMin: 4.1, congestionScore: 36 },
  { id: "r8", name: "Riverside Dr", trips: 16_450, avgSpeed: 36.9, delayMin: 5.7, congestionScore: 44 },
  { id: "r9", name: "University Blvd", trips: 22_180, avgSpeed: 31.2, delayMin: 8.3, congestionScore: 58 },
  { id: "r10", name: "Airport Expressway", trips: 29_640, avgSpeed: 67.4, delayMin: 2.1, congestionScore: 19 },
]

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

export type HeatmapCell = {
  day: (typeof HEATMAP_DAYS)[number]
  hour: number
  congestion: number
}

export const congestionHeatmapData: HeatmapCell[] = (() => {
  const rand = seededRandom(7)
  const cells: HeatmapCell[] = []
  for (let dayIdx = 0; dayIdx < HEATMAP_DAYS.length; dayIdx++) {
    const day = HEATMAP_DAYS[dayIdx]
    const isWeekend = dayIdx >= 5
    for (let hour = 0; hour < 24; hour++) {
      let base = 10
      if (!isWeekend) {
        if (hour >= 7 && hour <= 9) base = 75 + rand() * 20
        else if (hour >= 16 && hour <= 18) base = 80 + rand() * 18
        else if (hour >= 10 && hour <= 15) base = 35 + rand() * 15
        else if (hour >= 19 && hour <= 22) base = 25 + rand() * 15
        else base = 5 + rand() * 10
      } else {
        if (hour >= 11 && hour <= 19) base = 30 + rand() * 25
        else if (hour >= 20 && hour <= 23) base = 35 + rand() * 20
        else base = 5 + rand() * 10
      }
      cells.push({ day, hour, congestion: Math.round(base) })
    }
  }
  return cells
})()

export const heatmapDays = HEATMAP_DAYS

export type StationRidership = {
  id: string
  name: string
  mode: "Metro" | "Bus" | "Tram"
  ridership: number
  changePct: number
}

export const topStationsData: StationRidership[] = [
  { id: "s1", name: "Central Station", mode: "Metro", ridership: 142_300, changePct: 8.4 },
  { id: "s2", name: "Union Square", mode: "Metro", ridership: 118_750, changePct: 5.2 },
  { id: "s3", name: "Airport Terminal", mode: "Metro", ridership: 96_410, changePct: 12.1 },
  { id: "s4", name: "University Hub", mode: "Bus", ridership: 84_220, changePct: -2.3 },
  { id: "s5", name: "Riverside Plaza", mode: "Tram", ridership: 71_890, changePct: 4.7 },
  { id: "s6", name: "Stadium District", mode: "Bus", ridership: 64_530, changePct: 18.9 },
  { id: "s7", name: "Old Town", mode: "Tram", ridership: 58_140, changePct: 1.6 },
  { id: "s8", name: "Tech Park", mode: "Bus", ridership: 52_770, changePct: 9.3 },
  { id: "s9", name: "Harbor Front", mode: "Tram", ridership: 47_310, changePct: -1.8 },
  { id: "s10", name: "North Gateway", mode: "Metro", ridership: 43_980, changePct: 6.5 },
]

export const topStationsChartConfig = {
  ridership: { label: "Ridership", color: "var(--chart-1)" },
} satisfies ChartConfig
