"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  X,
  Layers,
  Play,
  Pause,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

export type MapFilters = {
  showCongestion: boolean
  showRoutes: boolean
  showVehicles: boolean
  showHeatmap: boolean
  showIncidents: boolean
  showTransitStops: boolean
  showCameras: boolean
  congestionSeverity: ("critical" | "warning" | "info")[]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
}

type HistoricalPlaybackProps = {
  timeHour: number | null
  onTimeHourChange: (hour: number | null) => void
  timePlaying: boolean
  onTimePlayingChange: (playing: boolean) => void
}

const legendItems = [
  { color: "#22c55e", label: "Free" },
  { color: "#eab308", label: "Moderate" },
  { color: "#ef4444", label: "Heavy" },
  { color: "#991b1b", label: "Gridlock" },
]

function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs">{label}</span>
      <Switch size="sm" checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

function formatHour(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`
}

const TICK_HOURS = [0, 6, 12, 18, 23]

function PanelContent({
  filters,
  onFiltersChange,
}: {
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
}) {
  return (
    <div className="space-y-3">
      {/* Layer toggles */}
      <div className="space-y-2">
        <FilterToggle
          label="Congestion Points"
          checked={filters.showCongestion}
          onChange={(v) =>
            onFiltersChange({ ...filters, showCongestion: v })
          }
        />
        <FilterToggle
          label="Traffic Routes"
          checked={filters.showRoutes}
          onChange={(v) =>
            onFiltersChange({ ...filters, showRoutes: v })
          }
        />
        <FilterToggle
          label="Vehicle Sensors"
          checked={filters.showVehicles}
          onChange={(v) =>
            onFiltersChange({ ...filters, showVehicles: v })
          }
        />
        <FilterToggle
          label="Transit Stops"
          checked={filters.showTransitStops}
          onChange={(v) =>
            onFiltersChange({ ...filters, showTransitStops: v })
          }
        />
        <FilterToggle
          label="Incidents & Events"
          checked={filters.showIncidents}
          onChange={(v) =>
            onFiltersChange({ ...filters, showIncidents: v })
          }
        />
        <FilterToggle
          label="Traffic Cameras"
          checked={filters.showCameras}
          onChange={(v) =>
            onFiltersChange({ ...filters, showCameras: v })
          }
        />
        <FilterToggle
          label="Traffic Heatmap"
          checked={filters.showHeatmap}
          onChange={(v) =>
            onFiltersChange({ ...filters, showHeatmap: v })
          }
        />
      </div>

      {/* Routes legend */}
      <div>
        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
          Routes
        </p>
        <div className="flex gap-1.5">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-0.5"
            >
              <span
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[9px] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HistoricalPlaybackControl({
  timeHour,
  onTimeHourChange,
  timePlaying,
  onTimePlayingChange,
}: HistoricalPlaybackProps) {
  const [expanded, setExpanded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHistorical = timeHour !== null

  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!timePlaying || !isHistorical) {
      clearAutoPlay()
      return
    }
    intervalRef.current = setInterval(() => {
      onTimeHourChange(((timeHour ?? 0) + 1) % 24)
    }, 1500)
    return clearAutoPlay
  }, [timePlaying, timeHour, isHistorical, onTimeHourChange, clearAutoPlay])

  const handlePlayPause = () => {
    if (!isHistorical) {
      onTimeHourChange(8)
      onTimePlayingChange(true)
    } else {
      onTimePlayingChange(!timePlaying)
    }
  }

  const handleToggleMode = () => {
    if (isHistorical) {
      onTimePlayingChange(false)
      onTimeHourChange(null)
    } else {
      onTimeHourChange(8)
    }
  }

  return (
    <div className="absolute bottom-3 left-3 z-20">
      {!expanded ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => setExpanded(true)}
              className={cn(
                "flex items-center justify-center size-9 rounded-lg border border-border bg-background/80 backdrop-blur-sm shadow-md transition-colors hover:bg-accent",
                isHistorical && "border-amber-500/30 bg-amber-500/10"
              )}
            >
              <History className={cn("size-4", isHistorical && "text-amber-600 dark:text-amber-400")} />
            </TooltipTrigger>
            <TooltipContent side="right">Historical Playback</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="rounded-lg border border-border bg-background/90 backdrop-blur-md shadow-lg p-2.5 w-56 space-y-2">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground">
              {isHistorical ? formatHour(timeHour!) : "Live"}
            </span>
            <div className="flex items-center gap-1">
              {isHistorical && (
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-[10px] font-medium text-green-600 dark:text-green-400 hover:underline"
                >
                  Back to Live
                </button>
              )}
              <button
                onClick={() => setExpanded(false)}
                className="flex items-center justify-center size-5 rounded transition-colors hover:bg-accent text-muted-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <Slider
            min={0}
            max={23}
            step={1}
            value={[isHistorical ? timeHour! : 12]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val
              onTimeHourChange(v)
              if (timePlaying) onTimePlayingChange(false)
            }}
          />
          <div className="flex justify-between">
            {TICK_HOURS.map((h) => (
              <span
                key={h}
                className={cn(
                  "text-[8px] text-muted-foreground/50 tabular-nums",
                  isHistorical && timeHour === h && "text-foreground font-medium"
                )}
              >
                {h.toString().padStart(2, "0")}:00
              </span>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handlePlayPause}
              className="size-6 shrink-0"
            >
              {timePlaying ? (
                <Pause className="size-3" />
              ) : (
                <Play className="size-3" />
              )}
            </Button>
            <span className="text-[10px] text-muted-foreground">
              {isHistorical ? "Scrub through the day" : "Press play to start"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export function MapOverlayPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: Props) {
  const isMobile = useIsMobile()

  const activeLayerCount = useMemo(() => {
    let count = 0
    if (filters.showCongestion) count++
    if (filters.showRoutes) count++
    if (filters.showVehicles) count++
    if (filters.showHeatmap) count++
    if (filters.showIncidents) count++
    if (filters.showTransitStops) count++
    if (filters.showCameras) count++
    return count
  }, [filters])

  const layerToggleButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "absolute top-3 left-3 z-20 flex items-center justify-center size-9 rounded-lg border border-border bg-background/80 backdrop-blur-sm shadow-md transition-colors hover:bg-accent",
            open && "hidden"
          )}
          onClick={() => onOpenChange(true)}
        >
          <Layers className="size-4" />
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-foreground text-background text-[9px] font-semibold">
            {activeLayerCount}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          Map Layers & Filters
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (isMobile) {
    return (
      <>
        {layerToggleButton}

        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2 text-sm">
                <Layers className="size-4" />
                Map Layers
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">
              <PanelContent filters={filters} onFiltersChange={onFiltersChange} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      {layerToggleButton}

      <div
        className={cn(
          "absolute top-3 left-3 z-20 w-64 transition-all duration-300",
          open
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <Card className="bg-background/90 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Layers className="size-3.5" />
                Map Layers
              </CardTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-3">
            <PanelContent filters={filters} onFiltersChange={onFiltersChange} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
