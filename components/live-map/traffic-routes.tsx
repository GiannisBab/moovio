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

export type SelectedRoute = {
  route: TrafficRoute
  coordinates: [number, number]
}

function getRouteMidpoint(coordinates: [number, number][]): [number, number] {
  const mid = Math.floor(coordinates.length / 2)
  return coordinates[mid]
}

export function TrafficRoutes({
  routes,
  onRouteClick,
}: {
  routes: TrafficRoute[]
  onRouteClick?: (selected: SelectedRoute) => void
}) {
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
          onClick={
            onRouteClick
              ? () =>
                  onRouteClick({
                    route,
                    coordinates: getRouteMidpoint(route.coordinates),
                  })
              : undefined
          }
        />
      ))}
    </>
  )
}
