"use client"

import { useEffect, useId } from "react"
import { useMap } from "@/components/ui/map"
import type MapLibreGL from "maplibre-gl"

type TrafficHeatmapProps = {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, { intensity: number }>
}

export function TrafficHeatmap({ data }: TrafficHeatmapProps) {
  const { map, isLoaded } = useMap()
  const id = useId()
  const sourceId = `heatmap-source-${id}`
  const layerId = `heatmap-layer-${id}`

  // Add source and layer
  useEffect(() => {
    if (!isLoaded || !map) return

    map.addSource(sourceId, {
      type: "geojson",
      data,
    })

    map.addLayer(
      {
        id: layerId,
        type: "heatmap",
        source: sourceId,
        paint: {
          // Weight by intensity property
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "intensity"],
            0, 0,
            1, 1,
          ],
          // Increase intensity as zoom level increases
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0.5,
            13, 1.5,
            16, 3,
          ],
          // Color ramp from transparent → green → yellow → red
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0, 0, 0, 0)",
            0.15, "rgba(34, 197, 94, 0.4)",
            0.35, "rgba(234, 179, 8, 0.6)",
            0.55, "rgba(239, 68, 68, 0.7)",
            0.8, "rgba(153, 27, 27, 0.85)",
            1, "rgba(127, 29, 29, 0.95)",
          ],
          // Radius increases with zoom
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 15,
            12, 25,
            16, 40,
          ],
          // Fade out at high zoom levels where individual points are more useful
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14, 0.8,
            18, 0.3,
          ],
        },
      },
      // Insert below labels/markers by finding the first symbol layer
      findFirstSymbolLayer(map)
    )

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map])

  // Update data
  useEffect(() => {
    if (!isLoaded || !map) return

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource
    if (source) {
      source.setData(data)
    }
  }, [isLoaded, map, data, sourceId])

  return null
}

function findFirstSymbolLayer(map: MapLibreGL.Map): string | undefined {
  const layers = map.getStyle().layers
  if (!layers) return undefined
  for (const layer of layers) {
    if (layer.type === "symbol") return layer.id
  }
  return undefined
}
