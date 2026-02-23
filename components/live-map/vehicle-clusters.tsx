"use client"

import { MapClusterLayer } from "@/components/ui/map"
import type { VehicleProperties } from "@/lib/data/live-map-data"

type SelectedVehicle = {
  coordinates: [number, number]
  properties: VehicleProperties
}

export function VehicleClusters({
  data,
  onPointClick,
}: {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, VehicleProperties>
  onPointClick: (vehicle: SelectedVehicle) => void
}) {
  return (
    <MapClusterLayer
      data={data}
      clusterRadius={60}
      clusterMaxZoom={15}
      clusterColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
      clusterThresholds={[20, 80]}
      pointColor="#3b82f6"
      onPointClick={(feature, coordinates) => {
        onPointClick({
          coordinates,
          properties: feature.properties as VehicleProperties,
        })
      }}
    />
  )
}

export type { SelectedVehicle }
