"use client"

import { useEffect, useRef, useCallback } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  Play,
  Pause,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  timeHour: number | null
  onTimeHourChange: (hour: number | null) => void
  timePlaying: boolean
  onTimePlayingChange: (playing: boolean) => void
}

const severityOptions = [
  { value: "critical" as const, label: "Critical", color: "bg-red-500" },
  { value: "warning" as const, label: "Warning", color: "bg-amber-500" },
  { value: "info" as const, label: "Info", color: "bg-blue-500" },
]

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

export function MapOverlayPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  timeHour,
  onTimeHourChange,
  timePlaying,
  onTimePlayingChange,
}: Props) {
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

  const toggleSeverity = (severity: "critical" | "warning" | "info") => {
    const current = filters.congestionSeverity
    const next = current.includes(severity)
      ? current.filter((s) => s !== severity)
      : [...current, severity]
    onFiltersChange({ ...filters, congestionSeverity: next })
  }

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
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute top-3 left-3 z-20 bg-background/80 backdrop-blur-sm shadow-md",
          open && "hidden"
        )}
        onClick={() => onOpenChange(true)}
      >
        <PanelLeftOpen className="size-4" />
      </Button>

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
                <PanelLeftClose className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-3">
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

            <Separator />

            {/* Severity + Legend row */}
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
                  Severity
                </p>
                <div className="flex flex-wrap gap-1">
                  {severityOptions.map((opt) => {
                    const active = filters.congestionSeverity.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleSeverity(opt.value)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors border",
                          active
                            ? "bg-secondary text-secondary-foreground border-border"
                            : "bg-transparent text-muted-foreground/50 border-transparent"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            active ? opt.color : "bg-muted-foreground/30"
                          )}
                        />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="shrink-0">
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

            <Separator />

            {/* Time slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Historical Playback
                </p>
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors border",
                    isHistorical
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
                      : "bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400"
                  )}
                >
                  <Radio className="size-2.5" />
                  {isHistorical ? formatHour(timeHour) : "Live"}
                </button>
              </div>
              <div className="flex items-center gap-2">
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
                <div className="flex-1 min-w-0">
                  <Slider
                    min={0}
                    max={23}
                    step={1}
                    value={[isHistorical ? timeHour : 12]}
                    onValueChange={(val) => {
                      const v = Array.isArray(val) ? val[0] : val
                      onTimeHourChange(v)
                      if (timePlaying) onTimePlayingChange(false)
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between px-8 mt-0.5">
                {TICK_HOURS.map((h) => (
                  <span
                    key={h}
                    className={cn(
                      "text-[9px] text-muted-foreground/60 tabular-nums",
                      isHistorical && timeHour === h && "text-foreground font-medium"
                    )}
                  >
                    {h.toString().padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
