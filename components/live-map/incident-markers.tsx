"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, CancelCircleIcon, Car02Icon, Clock01Icon, ConstructionIcon, Layers01Icon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl"
import { useDataLabel } from "@/components/i18n-provider"
import { formatEnglishRelative } from "@/lib/i18n/relative-time"
import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import type { Incident, IncidentType } from "@/lib/data/live-map-data"
import { cn } from "@/lib/utils"

const incidentTypeConfig: Record<
  IncidentType,
  {
    icon: typeof Car02Icon
    color: string
    markerBg: string
  }
> = {
  accident: {
    icon: Car02Icon,
    color: "text-red-600 dark:text-red-400",
    markerBg: "bg-red-600",
  },
  roadwork: {
    icon: ConstructionIcon,
    color: "text-orange-600 dark:text-orange-400",
    markerBg: "bg-orange-500",
  },
  closure: {
    icon: CancelCircleIcon,
    color: "text-rose-600 dark:text-rose-400",
    markerBg: "bg-rose-600",
  },
  event: {
    icon: Calendar01Icon,
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
  const tType = useTranslations("IncidentTypes")
  const tMap = useTranslations("LiveMap")
  const tTime = useTranslations("RelativeTime")
  const dl = useDataLabel()
  return (
    <>
      {incidents.map((incident) => {
        const config = incidentTypeConfig[incident.type]
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
                  <HugeiconsIcon icon={config.icon} className="size-4 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="w-64 space-y-2 pr-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={config.icon} className={cn("size-3.5", config.color)} />
                    <span className="font-semibold text-sm">
                      {dl(incident.title)}
                    </span>
                  </div>
                  <Badge variant={badge.variant} className={badge.className}>
                    {tType(incident.type)}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {dl(incident.location)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dl(incident.description)}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                    {formatEnglishRelative(incident.reportedAt, tTime)}
                  </span>
                  {incident.estimatedClearance && (
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      {tMap("eta", { value: dl(incident.estimatedClearance) })}
                    </span>
                  )}
                  {incident.lanesAffected && (
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Layers01Icon} className="size-3" />
                      {tMap("lanesAffected", { count: incident.lanesAffected })}
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
