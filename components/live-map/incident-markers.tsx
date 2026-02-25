"use client"

import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import {
  CarFront,
  Construction,
  Ban,
  Calendar,
  Clock,
  Layers,
} from "lucide-react"
import type { Incident, IncidentType } from "@/lib/data/live-map-data"
import { cn } from "@/lib/utils"

const incidentTypeConfig: Record<
  IncidentType,
  {
    icon: typeof CarFront
    label: string
    color: string
    markerBg: string
  }
> = {
  accident: {
    icon: CarFront,
    label: "Accident",
    color: "text-red-600 dark:text-red-400",
    markerBg: "bg-red-600",
  },
  roadwork: {
    icon: Construction,
    label: "Roadwork",
    color: "text-orange-600 dark:text-orange-400",
    markerBg: "bg-orange-500",
  },
  closure: {
    icon: Ban,
    label: "Closure",
    color: "text-rose-600 dark:text-rose-400",
    markerBg: "bg-rose-600",
  },
  event: {
    icon: Calendar,
    label: "Event",
    color: "text-violet-600 dark:text-violet-400",
    markerBg: "bg-violet-500",
  },
}

const severityBadge = {
  critical: { variant: "destructive" as const, className: undefined },
  warning: {
    variant: "outline" as const,
    className: "border-amber-500 text-amber-600 dark:text-amber-400",
  },
  info: { variant: "secondary" as const, className: undefined },
}

export function IncidentMarkers({ incidents }: { incidents: Incident[] }) {
  return (
    <>
      {incidents.map((incident) => {
        const config = incidentTypeConfig[incident.type]
        const Icon = config.icon
        const badge = severityBadge[incident.severity]

        return (
          <MapMarker
            key={incident.id}
            longitude={incident.longitude}
            latitude={incident.latitude}
          >
            <MarkerContent>
              <div className="relative">
                {incident.severity === "critical" && (
                  <span
                    className={cn(
                      "absolute inset-0 rounded-lg animate-ping opacity-40",
                      config.markerBg
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-lg shadow-lg border-2 border-white",
                    config.markerBg
                  )}
                >
                  <Icon className="size-4 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="w-64 space-y-2 pr-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={cn("size-3.5", config.color)} />
                    <span className="font-semibold text-sm">
                      {incident.title}
                    </span>
                  </div>
                  <Badge variant={badge.variant} className={badge.className}>
                    {config.label}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {incident.location}
                </p>
                <p className="text-xs text-muted-foreground">
                  {incident.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {incident.reportedAt}
                  </span>
                  {incident.estimatedClearance && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      ETA: {incident.estimatedClearance}
                    </span>
                  )}
                  {incident.lanesAffected && (
                    <span className="flex items-center gap-1">
                      <Layers className="size-3" />
                      {incident.lanesAffected} lane{incident.lanesAffected > 1 ? "s" : ""} affected
                    </span>
                  )}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        )
      })}
    </>
  )
}
