"use client"

import { useState, useCallback } from "react"
import { Map, MapControls, MapPopup } from "@/components/ui/map"
import { CongestionMarkers } from "./congestion-markers"
import { TrafficRoutes } from "./traffic-routes"
import { VehicleClusters, type SelectedVehicle } from "./vehicle-clusters"
import { MapOverlayPanel, type MapFilters } from "./map-overlay-panel"
import {
  congestionPoints,
  trafficRoutes,
  vehicleClusterData,
} from "@/lib/data/live-map-data"
import { Bus, Car, CarTaxiFront, Gauge, Radio } from "lucide-react"

const vehicleTypeConfig = {
  bus: { icon: Bus, label: "Bus" },
  taxi: { icon: CarTaxiFront, label: "Taxi" },
  car: { icon: Car, label: "Car" },
  sensor: { icon: Radio, label: "Sensor" },
}

export function LiveMap() {
  const [filters, setFilters] = useState<MapFilters>({
    showCongestion: true,
    showRoutes: true,
    showVehicles: false,
    congestionSeverity: ["critical", "warning", "info"],
  })
  const [panelOpen, setPanelOpen] = useState(true)
  const [selectedVehicle, setSelectedVehicle] =
    useState<SelectedVehicle | null>(null)

  const filteredCongestion = congestionPoints.filter((p) =>
    filters.congestionSeverity.includes(p.severity)
  )

  const handlePointClick = useCallback((vehicle: SelectedVehicle) => {
    setSelectedVehicle(vehicle)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedVehicle(null)
  }, [])

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full">
      <Map
        center={[23.7275, 37.9838]}
        zoom={12}
        minZoom={0}
        maxZoom={18}
        className="h-full w-full"
      >
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
        />

        {filters.showCongestion && (
          <CongestionMarkers points={filteredCongestion} />
        )}

        {filters.showRoutes && <TrafficRoutes routes={trafficRoutes} />}

        {filters.showVehicles && (
          <VehicleClusters
            data={vehicleClusterData}
            onPointClick={handlePointClick}
          />
        )}

        {selectedVehicle && (
          <MapPopup
            longitude={selectedVehicle.coordinates[0]}
            latitude={selectedVehicle.coordinates[1]}
            closeButton
            onClose={handleClosePopup}
          >
            <VehiclePopupContent vehicle={selectedVehicle} />
          </MapPopup>
        )}
      </Map>

      <MapOverlayPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}

function VehiclePopupContent({ vehicle }: { vehicle: SelectedVehicle }) {
  const config = vehicleTypeConfig[vehicle.properties.type]
  const Icon = config.icon

  return (
    <div className="w-48 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-7 rounded-full bg-blue-500/10">
          <Icon className="size-4 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold">{config.label}</p>
          <p className="text-[10px] text-muted-foreground">
            {vehicle.properties.id}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Gauge className="size-3" />
        {vehicle.properties.speed} km/h
      </div>
    </div>
  )
}
