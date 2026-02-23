"use client"

import { MapRoute } from "@/components/ui/map"
import type { TrafficRoute } from "@/lib/data/live-map-data"
import { congestionLevelColors } from "@/lib/data/live-map-data"

const widthByLevel: Record<TrafficRoute["congestionLevel"], number> = {
  free: 3,
  moderate: 3,
  heavy: 4,
  gridlock: 5,
}

export function TrafficRoutes({ routes }: { routes: TrafficRoute[] }) {
  return (
    <>
      {routes.map((route) => (
        <MapRoute
          key={route.id}
          id={route.id}
          coordinates={route.coordinates}
          color={congestionLevelColors[route.congestionLevel]}
          width={widthByLevel[route.congestionLevel]}
          opacity={0.85}
        />
      ))}
    </>
  )
}
