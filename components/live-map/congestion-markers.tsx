"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, AlertCircleIcon, Clock01Icon, DashboardSpeedIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl"
import { useDataLabel } from "@/components/i18n-provider"
import { formatEnglishRelative } from "@/lib/i18n/relative-time"
import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import type { CongestionPoint } from "@/lib/data/live-map-data"
import { cn } from "@/lib/utils"

const severityConfig = {
  critical: {
    icon: Alert01Icon,
    color: "bg-red-500",
    pulseColor: "bg-red-400",
    badge: "destructive" as const,
    labelKey: "critical" as const,
  },
  warning: {
    icon: AlertCircleIcon,
    color: "bg-amber-500",
    pulseColor: "bg-amber-400",
    badge: "outline" as const,
    labelKey: "warning" as const,
    badgeClass: "border-amber-500 text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: InformationCircleIcon,
    color: "bg-blue-500",
    pulseColor: "bg-blue-400",
    badge: "secondary" as const,
    labelKey: "info" as const,
  },
}

export function CongestionMarkers({ points }: { points: CongestionPoint[] }) {
  const tSeverity = useTranslations("Severity")
  const tMap = useTranslations("LiveMap")
  const tTime = useTranslations("RelativeTime")
  const dl = useDataLabel()
  return (
    <>
      {points.map((point) => {
        const config = severityConfig[point.severity]
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
                  <HugeiconsIcon icon={config.icon} className="size-4 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="w-60 space-y-2 pr-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{dl(point.location)}</span>
                  <Badge
                    variant={config.badge}
                    className={
                      "badgeClass" in config ? config.badgeClass : undefined
                    }
                  >
                    {tSeverity(config.labelKey)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dl(point.description)}
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={DashboardSpeedIcon} className="size-3" />
                    {tMap("kmh", { value: point.avgSpeed })}
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                    {tMap("delayMin", { value: point.delayMinutes })}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {formatEnglishRelative(point.time, tTime)}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        )
      })}
    </>
  )
}
