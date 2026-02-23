// Live Map Mock Data — Athens, Greece

export type CongestionPoint = {
  id: string
  longitude: number
  latitude: number
  location: string
  severity: "critical" | "warning" | "info"
  description: string
  avgSpeed: number
  delayMinutes: number
  time: string
}

export type TrafficRoute = {
  id: string
  name: string
  coordinates: [number, number][]
  congestionLevel: "free" | "moderate" | "heavy" | "gridlock"
  avgSpeed: number
}

export type VehicleProperties = {
  id: string
  type: "bus" | "taxi" | "car" | "sensor"
  speed: number
}

export const congestionLevelColors: Record<
  TrafficRoute["congestionLevel"],
  string
> = {
  free: "#22c55e",
  moderate: "#eab308",
  heavy: "#ef4444",
  gridlock: "#991b1b",
}

export const congestionPoints: CongestionPoint[] = [
  {
    id: "cp-1",
    longitude: 23.7353,
    latitude: 37.9755,
    location: "Syntagma Square",
    severity: "critical",
    description: "Major accident on Amalias Ave, 2 lanes blocked. Expect 40min delay.",
    avgSpeed: 8,
    delayMinutes: 40,
    time: "3 min ago",
  },
  {
    id: "cp-2",
    longitude: 23.7282,
    latitude: 37.9842,
    location: "Omonia Square",
    severity: "warning",
    description: "Construction zone on Stadiou St reducing traffic to single lane.",
    avgSpeed: 15,
    delayMinutes: 20,
    time: "12 min ago",
  },
  {
    id: "cp-3",
    longitude: 23.749,
    latitude: 37.992,
    location: "Kifissias Ave & Alexandras",
    severity: "critical",
    description: "Rush hour gridlock at major intersection. Heavy bus and car congestion.",
    avgSpeed: 5,
    delayMinutes: 35,
    time: "1 min ago",
  },
  {
    id: "cp-4",
    longitude: 23.644,
    latitude: 37.943,
    location: "Piraeus Port Entrance",
    severity: "warning",
    description: "Ferry arrivals causing port traffic buildup on Akti Miaouli.",
    avgSpeed: 12,
    delayMinutes: 25,
    time: "18 min ago",
  },
  {
    id: "cp-5",
    longitude: 23.778,
    latitude: 37.99,
    location: "Attiki Odos — Katechaki Exit",
    severity: "info",
    description: "Moderate traffic buildup at exit ramp, clearing gradually.",
    avgSpeed: 28,
    delayMinutes: 10,
    time: "25 min ago",
  },
  {
    id: "cp-6",
    longitude: 23.715,
    latitude: 37.912,
    location: "Vouliagmenis Ave — Alimos",
    severity: "warning",
    description: "Event at Alimos Marina causing unusual evening congestion.",
    avgSpeed: 18,
    delayMinutes: 15,
    time: "8 min ago",
  },
  {
    id: "cp-7",
    longitude: 23.731,
    latitude: 37.988,
    location: "Patision & 28th October St",
    severity: "info",
    description: "Minor congestion from double-parked delivery vehicles.",
    avgSpeed: 22,
    delayMinutes: 8,
    time: "32 min ago",
  },
  {
    id: "cp-8",
    longitude: 23.76,
    latitude: 38.02,
    location: "National Road — Lamia Direction",
    severity: "info",
    description: "Scheduled road maintenance on northbound lanes. Minor delays.",
    avgSpeed: 35,
    delayMinutes: 5,
    time: "1 hr ago",
  },
  {
    id: "cp-9",
    longitude: 23.6985,
    latitude: 37.9685,
    location: "Iera Odos — Egaleo",
    severity: "critical",
    description: "Overturned truck blocking 2 of 3 lanes. Emergency services on scene.",
    avgSpeed: 6,
    delayMinutes: 50,
    time: "5 min ago",
  },
]

export const trafficRoutes: TrafficRoute[] = [
  {
    id: "route-kifissias",
    name: "Kifissias Avenue",
    congestionLevel: "heavy",
    avgSpeed: 15,
    coordinates: [
      [23.7490, 37.9920],
      [23.7530, 37.9980],
      [23.7560, 38.0050],
      [23.7590, 38.0130],
      [23.7620, 38.0210],
      [23.7650, 38.0300],
      [23.7680, 38.0380],
    ],
  },
  {
    id: "route-vouliagmenis",
    name: "Vouliagmenis Avenue",
    congestionLevel: "moderate",
    avgSpeed: 25,
    coordinates: [
      [23.7290, 37.9680],
      [23.7260, 37.9580],
      [23.7230, 37.9490],
      [23.7200, 37.9380],
      [23.7170, 37.9280],
      [23.7150, 37.9180],
    ],
  },
  {
    id: "route-alexandras",
    name: "Alexandras Avenue",
    congestionLevel: "gridlock",
    avgSpeed: 8,
    coordinates: [
      [23.7130, 37.9920],
      [23.7220, 37.9910],
      [23.7320, 37.9905],
      [23.7420, 37.9910],
      [23.7490, 37.9920],
      [23.7560, 37.9930],
    ],
  },
  {
    id: "route-patision",
    name: "Patision Street",
    congestionLevel: "moderate",
    avgSpeed: 20,
    coordinates: [
      [23.7310, 37.9840],
      [23.7315, 37.9900],
      [23.7320, 37.9960],
      [23.7325, 38.0020],
      [23.7330, 38.0080],
    ],
  },
  {
    id: "route-iera-odos",
    name: "Iera Odos (Piraeus–Athens)",
    congestionLevel: "free",
    avgSpeed: 50,
    coordinates: [
      [23.6500, 37.9470],
      [23.6620, 37.9520],
      [23.6750, 37.9570],
      [23.6880, 37.9620],
      [23.7010, 37.9670],
      [23.7150, 37.9730],
    ],
  },
  {
    id: "route-attiki-odos",
    name: "Attiki Odos (Ring Road)",
    congestionLevel: "free",
    avgSpeed: 85,
    coordinates: [
      [23.7000, 38.0200],
      [23.7200, 38.0150],
      [23.7400, 38.0050],
      [23.7600, 37.9980],
      [23.7800, 37.9930],
      [23.8000, 37.9900],
      [23.8200, 37.9920],
    ],
  },
]

// Deterministic pseudo-random number generator (mulberry32)
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function generateVehicleClusterData(): GeoJSON.FeatureCollection<
  GeoJSON.Point,
  VehicleProperties
> {
  const types: VehicleProperties["type"][] = ["bus", "taxi", "car", "sensor"]
  const features: GeoJSON.Feature<GeoJSON.Point, VehicleProperties>[] = []

  // Center clusters around key Athens areas
  const clusters = [
    { lng: 23.7275, lat: 37.9838, weight: 0.4, spread: 0.015 }, // City center
    { lng: 23.749, lat: 37.992, weight: 0.2, spread: 0.01 },    // Kifissias corridor
    { lng: 23.644, lat: 37.943, weight: 0.15, spread: 0.012 },  // Piraeus
    { lng: 23.715, lat: 37.912, weight: 0.1, spread: 0.01 },    // Alimos
    { lng: 23.76, lat: 38.02, weight: 0.15, spread: 0.02 },     // Northern suburbs
  ]

  let pointIndex = 0
  for (const cluster of clusters) {
    const count = Math.round(200 * cluster.weight)
    for (let i = 0; i < count; i++) {
      const seed = pointIndex * 7 + 42
      const r1 = seededRandom(seed)
      const r2 = seededRandom(seed + 1)
      const r3 = seededRandom(seed + 2)
      const r4 = seededRandom(seed + 3)

      const lng = cluster.lng + (r1 - 0.5) * 2 * cluster.spread
      const lat = cluster.lat + (r2 - 0.5) * 2 * cluster.spread
      const type = types[Math.floor(r3 * types.length)]
      const speed = Math.round(5 + r4 * 75)

      features.push({
        type: "Feature",
        properties: {
          id: `v-${pointIndex}`,
          type,
          speed,
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      })
      pointIndex++
    }
  }

  return {
    type: "FeatureCollection",
    features,
  }
}

export const vehicleClusterData = generateVehicleClusterData()
