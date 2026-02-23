"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PanelLeftClose, PanelLeftOpen, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export type MapFilters = {
  showCongestion: boolean
  showRoutes: boolean
  showVehicles: boolean
  congestionSeverity: ("critical" | "warning" | "info")[]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
}

const severityOptions = [
  { value: "critical" as const, label: "Critical", color: "bg-red-500" },
  { value: "warning" as const, label: "Warning", color: "bg-amber-500" },
  { value: "info" as const, label: "Info", color: "bg-blue-500" },
]

const legendItems = [
  { color: "#22c55e", label: "Free flow" },
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
      <span className="text-sm">{label}</span>
      <Switch size="sm" checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

export function MapOverlayPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: Props) {
  const toggleSeverity = (severity: "critical" | "warning" | "info") => {
    const current = filters.congestionSeverity
    const next = current.includes(severity)
      ? current.filter((s) => s !== severity)
      : [...current, severity]
    onFiltersChange({ ...filters, congestionSeverity: next })
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
          "absolute top-3 left-3 z-20 w-72 transition-all duration-300",
          open
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <Card className="bg-background/90 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Layers className="size-4" />
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
          <CardContent className="space-y-4">
            <div className="space-y-3">
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
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Congestion Severity
              </p>
              <div className="flex flex-wrap gap-1.5">
                {severityOptions.map((opt) => {
                  const active = filters.congestionSeverity.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleSeverity(opt.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                        active
                          ? "bg-secondary text-secondary-foreground border-border"
                          : "bg-transparent text-muted-foreground/50 border-transparent"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          active ? opt.color : "bg-muted-foreground/30"
                        )}
                      />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Route Legend
              </p>
              <div className="space-y-1.5">
                {legendItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className="size-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
