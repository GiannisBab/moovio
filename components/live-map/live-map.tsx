"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Bus01Icon, Car01Icon, DashboardSpeedIcon, RadioIcon, Route01Icon, TaxiIcon } from "@hugeicons/core-free-icons";
import { useState, useCallback, useMemo } from "react"
import { Map, MapControls, MapPopup } from "@/components/ui/map"
import { CongestionMarkers } from "./congestion-markers"
import { TrafficRoutes, type SelectedRoute } from "./traffic-routes"
import { VehicleClusters, type SelectedVehicle } from "./vehicle-clusters"
import { MapOverlayPanel, HistoricalPlaybackControl, type MapFilters } from "./map-overlay-panel"
import { TrafficHeatmap } from "./traffic-heatmap"
import { IncidentMarkers } from "./incident-markers"
import { TransitStopMarkers } from "./transit-stop-markers"
import { CameraFeedMarkers } from "./camera-feeds"
import {
  congestionPoints,
  trafficRoutes,
  vehicleClusterData,
  heatmapData,
  incidents,
  transitStops,
  trafficCameras,
  generateHistoricalSnapshot,
  type TrafficRoute,
} from "@/lib/data/live-map-data"
import { congestionLevelColors } from "@/lib/data/live-map-data"

const DEFAULT_CENTER: [number, number] = [23.7275, 37.9838]
const DEFAULT_ZOOM = 12

const vehicleTypeConfig = {
  bus: { icon: Bus01Icon, label: "Bus" },
  taxi: { icon: TaxiIcon, label: "Taxi" },
  car: { icon: Car01Icon, label: "Car" },
  sensor: { icon: RadioIcon, label: "Sensor" },
}

export function LiveMap() {
  const [filters, setFilters] = useState<MapFilters>({
    showCongestion: true,
    showRoutes: true,
    showVehicles: false,
    showHeatmap: false,
    showIncidents: true,
    showTransitStops: false,
    showCameras: true,
    congestionSeverity: ["critical", "warning", "info"],
  })
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] =
    useState<SelectedVehicle | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<SelectedRoute | null>(null)
  const [timeHour, setTimeHour] = useState<number | null>(null)
  const [timePlaying, setTimePlaying] = useState(false)

  const snapshot = useMemo(
    () => (timeHour !== null ? generateHistoricalSnapshot(timeHour) : null),
    [timeHour]
  )

  const activeCongestion = snapshot?.congestionPoints ?? congestionPoints
  const activeIncidents = snapshot?.incidents ?? incidents
  const activeRoutes = snapshot?.trafficRoutes ?? trafficRoutes
  const activeVehicles = snapshot?.vehicleClusterData ?? vehicleClusterData
  const activeHeatmap = snapshot?.heatmapData ?? heatmapData

  const filteredCongestion = activeCongestion.filter((p) =>
    filters.congestionSeverity.includes(p.severity)
  )

  const handlePointClick = useCallback((vehicle: SelectedVehicle) => {
    setSelectedRoute(null)
    setSelectedVehicle(vehicle)
  }, [])

  const handleRouteClick = useCallback((selected: SelectedRoute) => {
    setSelectedVehicle(null)
    setSelectedRoute(selected)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedVehicle(null)
    setSelectedRoute(null)
  }, [])

  return (
    <div className="relative h-[calc(100dvh-3.5rem)] w-full">
      <Map
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={0}
        maxZoom={18}
        className="h-full w-full"
      >
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
        {filters.showHeatmap && <TrafficHeatmap data={activeHeatmap} />}

        {filters.showCongestion && (
          <CongestionMarkers points={filteredCongestion} />
        )}

        {filters.showRoutes && (
          <TrafficRoutes routes={activeRoutes} onRouteClick={handleRouteClick} />
        )}

        {filters.showTransitStops && (
          <TransitStopMarkers stops={transitStops} />
        )}

        {filters.showIncidents && (
          <IncidentMarkers incidents={activeIncidents} />
        )}

        {filters.showCameras && (
          <CameraFeedMarkers cameras={trafficCameras} />
        )}

        {filters.showVehicles && (
          <VehicleClusters
            data={activeVehicles}
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

        {selectedRoute && (
          <MapPopup
            longitude={selectedRoute.coordinates[0]}
            latitude={selectedRoute.coordinates[1]}
            closeButton
            onClose={handleClosePopup}
          >
            <RoutePopupContent route={selectedRoute.route} />
          </MapPopup>
        )}
      </Map>

      <MapOverlayPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <HistoricalPlaybackControl
        timeHour={timeHour}
        onTimeHourChange={setTimeHour}
        timePlaying={timePlaying}
        onTimePlayingChange={setTimePlaying}
      />
    </div>
  )
}

const congestionLevelLabels: Record<string, string> = {
  free: "Free Flow",
  moderate: "Moderate",
  heavy: "Heavy",
  gridlock: "Gridlock",
}

function RoutePopupContent({ route }: { route: TrafficRoute }) {
  const level = route.congestionLevel
  const color = congestionLevelColors[level]

  return (
    <div className="w-48 space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center size-7 rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <HugeiconsIcon icon={Route01Icon} className="size-4" style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-semibold">{route.name}</p>
          <p className="text-[10px] text-muted-foreground" style={{ color }}>
            {congestionLevelLabels[level]}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon icon={DashboardSpeedIcon} className="size-3" />
        {route.avgSpeed} km/h avg
      </div>
    </div>
  )
}

function VehiclePopupContent({ vehicle }: { vehicle: SelectedVehicle }) {
  const config = vehicleTypeConfig[vehicle.properties.type]

  return (
    <div className="w-48 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-7 rounded-full bg-blue-500/10">
          <HugeiconsIcon icon={config.icon} className="size-4 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold">{config.label}</p>
          <p className="text-[10px] text-muted-foreground">
            {vehicle.properties.id}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon icon={DashboardSpeedIcon} className="size-3" />
        {vehicle.properties.speed} km/h
      </div>
    </div>
  )
}
