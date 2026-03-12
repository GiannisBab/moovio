"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Bus01Icon, Train02Icon, TramIcon, UniversalAccessIcon, ZapIcon } from "@hugeicons/core-free-icons";
import {
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import type { TransitStop, TransitStopType } from "@/lib/data/live-map-data"
import { cn } from "@/lib/utils"

const stopTypeConfig: Record<
  TransitStopType,
  {
    icon: typeof Bus01Icon
    label: string
    color: string
    bgColor: string
    markerBg: string
  }
> = {
  metro: {
    icon: Train02Icon,
    label: "Metro",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    markerBg: "bg-blue-600",
  },
  bus: {
    icon: Bus01Icon,
    label: "Bus Stop",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    markerBg: "bg-emerald-600",
  },
  tram: {
    icon: TramIcon,
    label: "Tram",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    markerBg: "bg-cyan-600",
  },
  trolleybus: {
    icon: ZapIcon,
    label: "Trolleybus",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    markerBg: "bg-amber-600",
  },
}

export function TransitStopMarkers({ stops }: { stops: TransitStop[] }) {
  return (
    <>
      {stops.map((stop) => {
        const config = stopTypeConfig[stop.type]

        return (
          <MapMarker
            key={stop.id}
            longitude={stop.longitude}
            latitude={stop.latitude}
          >
            <MarkerContent>
              <div
                className={cn(
                  "flex items-center justify-center size-7 rounded-full shadow-md border-2 border-white",
                  config.markerBg
                )}
              >
                <HugeiconsIcon icon={config.icon} className="size-3.5 text-white" />
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="w-56 space-y-2 pr-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center justify-center size-7 rounded-full",
                        config.bgColor
                      )}
                    >
                      <HugeiconsIcon icon={config.icon} className={cn("size-4", config.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{stop.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {config.label}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stop.lines.map((line) => (
                    <Badge key={line} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {line}
                    </Badge>
                  ))}
                </div>
                {stop.accessible && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={UniversalAccessIcon} className="size-3" />
                    Wheelchair accessible
                  </div>
                )}
              </div>
            </MarkerPopup>
          </MapMarker>
        )
      })}
    </>
  )
}
