"use client"

import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Clock, Gauge } from "lucide-react"
import type { CongestionPoint } from "@/lib/data/live-map-data"
import { cn } from "@/lib/utils"

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "bg-red-500",
    pulseColor: "bg-red-400",
    badge: "destructive" as const,
    label: "Critical",
  },
  warning: {
    icon: AlertCircle,
    color: "bg-amber-500",
    pulseColor: "bg-amber-400",
    badge: "outline" as const,
    label: "Warning",
    badgeClass: "border-amber-500 text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    color: "bg-blue-500",
    pulseColor: "bg-blue-400",
    badge: "secondary" as const,
    label: "Info",
  },
}

export function CongestionMarkers({ points }: { points: CongestionPoint[] }) {
  return (
    <>
      {points.map((point) => {
        const config = severityConfig[point.severity]
        const Icon = config.icon
        return (
          <MapMarker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
          >
            <MarkerContent>
              <div className="relative">
                {point.severity === "critical" && (
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full animate-ping opacity-40",
                      config.pulseColor
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full shadow-lg border-2 border-white",
                    config.color
                  )}
                >
                  <Icon className="size-4 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="w-60 space-y-2 pr-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{point.location}</span>
                  <Badge
                    variant={config.badge}
                    className={
                      "badgeClass" in config ? config.badgeClass : undefined
                    }
                  >
                    {config.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {point.description}
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Gauge className="size-3" />
                    {point.avgSpeed} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    +{point.delayMinutes} min
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {point.time}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        )
      })}
    </>
  )
}
