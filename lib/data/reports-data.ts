import { dailyTripsData } from "@/lib/data/analytics-data"

type Severity = "critical" | "warning" | "info"
type Status = "complete" | "partial" | "pending"

function seededRandom(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, "0")
}

export type DailySummaryRow = {
  id: string
  date: string
  totalTrips: number
  avgSpeed: number
  incidents: number
  status: Status
}

export const dailySummaryReports: DailySummaryRow[] = (() => {
  const rand = seededRandom(101)
  return dailyTripsData
    .slice(-30)
    .reverse()
    .map((d, i) => {
      const r = rand()
      const status: Status = r > 0.85 ? "partial" : r > 0.95 ? "pending" : "complete"
      return {
        id: `ds-${i}`,
        date: d.date,
        totalTrips: d.trips,
        avgSpeed: d.avgSpeed,
        incidents: Math.round(rand() * 18 + 4),
        status,
      }
    })
})()

export type IncidentRow = {
  id: string
  date: string
  type: "accident" | "roadwork" | "closure" | "event"
  location: string
  severity: Severity
  durationMin: number
  resolvedAt: string | null
}

const INCIDENT_LOCATIONS = [
  "Highway A1 — Northbound",
  "Highway A1 — Southbound",
  "Main St & 5th Ave",
  "Central Station Area",
  "Ring Road — Eastbound",
  "Industrial Park Rd",
  "Riverside Dr",
  "University Blvd",
  "Airport Expressway",
  "Old Town Square",
  "Harbor Bridge",
  "Stadium Approach",
] as const

const INCIDENT_TYPES: IncidentRow["type"][] = ["accident", "roadwork", "closure", "event"]
const SEVERITIES: Severity[] = ["critical", "warning", "info"]

export const incidentReports: IncidentRow[] = (() => {
  const rand = seededRandom(202)
  const rows: IncidentRow[] = []
  for (let i = 0; i < 32; i++) {
    const dayOffset = Math.floor(rand() * 30)
    const dayData = dailyTripsData[dailyTripsData.length - 1 - dayOffset]
    const hour = Math.floor(rand() * 24)
    const minute = Math.floor(rand() * 60)
    const date = `${dayData.date} ${pad(hour)}:${pad(minute)}`
    const severity = SEVERITIES[Math.floor(rand() * SEVERITIES.length)]
    const type = INCIDENT_TYPES[Math.floor(rand() * INCIDENT_TYPES.length)]
    const durationMin = Math.round(rand() * (severity === "critical" ? 120 : 60) + 15)
    const resolved = rand() > 0.15
    rows.push({
      id: `inc-${i}`,
      date,
      type,
      location: INCIDENT_LOCATIONS[Math.floor(rand() * INCIDENT_LOCATIONS.length)],
      severity,
      durationMin,
      resolvedAt: resolved
        ? `${dayData.date} ${pad((hour + Math.ceil(durationMin / 60)) % 24)}:${pad(minute)}`
        : null,
    })
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1))
})()

export type RidershipRow = {
  id: string
  date: string
  mode: "Metro" | "Bus" | "Tram"
  station: string
  ridership: number
  changePct: number
}

const STATIONS_BY_MODE: Record<RidershipRow["mode"], string[]> = {
  Metro: ["Central Station", "Union Square", "Airport Terminal", "North Gateway", "South Plaza"],
  Bus: ["University Hub", "Stadium District", "Tech Park", "Industrial Loop", "West End"],
  Tram: ["Riverside Plaza", "Old Town", "Harbor Front", "Cultural Quarter", "Garden District"],
}

const MODES: RidershipRow["mode"][] = ["Metro", "Bus", "Tram"]

export const ridershipReports: RidershipRow[] = (() => {
  const rand = seededRandom(303)
  const rows: RidershipRow[] = []
  for (let i = 0; i < 36; i++) {
    const dayOffset = Math.floor(rand() * 30)
    const dayData = dailyTripsData[dailyTripsData.length - 1 - dayOffset]
    const mode = MODES[Math.floor(rand() * MODES.length)]
    const stations = STATIONS_BY_MODE[mode]
    const station = stations[Math.floor(rand() * stations.length)]
    const base = mode === "Metro" ? 90_000 : mode === "Bus" ? 55_000 : 45_000
    rows.push({
      id: `rs-${i}`,
      date: dayData.date,
      mode,
      station,
      ridership: Math.round(base * (0.7 + rand() * 0.6)),
      changePct: Number(((rand() - 0.4) * 25).toFixed(1)),
    })
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1))
})()

export type CongestionRow = {
  id: string
  date: string
  location: string
  severity: Severity
  peakHour: string
  durationMin: number
}

export const congestionReports: CongestionRow[] = (() => {
  const rand = seededRandom(404)
  const rows: CongestionRow[] = []
  for (let i = 0; i < 34; i++) {
    const dayOffset = Math.floor(rand() * 30)
    const dayData = dailyTripsData[dailyTripsData.length - 1 - dayOffset]
    const severity = SEVERITIES[Math.floor(rand() * SEVERITIES.length)]
    const isMorning = rand() > 0.5
    const hour = isMorning ? 7 + Math.floor(rand() * 3) : 16 + Math.floor(rand() * 3)
    rows.push({
      id: `cg-${i}`,
      date: dayData.date,
      location: INCIDENT_LOCATIONS[Math.floor(rand() * INCIDENT_LOCATIONS.length)],
      severity,
      peakHour: `${pad(hour)}:00`,
      durationMin: Math.round(rand() * (severity === "critical" ? 90 : 50) + 20),
    })
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1))
})()
