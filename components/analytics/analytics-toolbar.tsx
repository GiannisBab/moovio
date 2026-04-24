"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DateRangePicker } from "@/components/analytics/date-range-picker"
import {
  PRESET_OPTIONS,
  resolvePreset,
  type AnalyticsFilter,
  type AnalyticsPreset,
} from "@/lib/analytics-filter"
import { cn } from "@/lib/utils"

type Props = {
  value: AnalyticsFilter
  onChange: (next: AnalyticsFilter) => void
  onExport?: () => void
  exportLabel?: string
  className?: string
}

export function AnalyticsToolbar({
  value,
  onChange,
  onExport,
  exportLabel = "Export",
  className,
}: Props) {
  const presetValue: AnalyticsPreset = value.preset

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <ToggleGroup
        value={presetValue === "custom" ? [] : [presetValue]}
        onValueChange={(val) => {
          if (val.length === 0) return
          const next = val[0] as Exclude<AnalyticsPreset, "custom">
          if (next === presetValue) return
          onChange({ preset: next, range: resolvePreset(next) })
        }}
        variant="outline"
        size="sm"
        className="hidden sm:inline-flex"
      >
        {PRESET_OPTIONS.map((p) => (
          <ToggleGroupItem key={p.value} value={p.value}>
            {p.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <DateRangePicker value={value} onChange={onChange} />
      {onExport && (
        <Button variant="outline" size="sm" onClick={onExport}>
          <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
          {exportLabel}
        </Button>
      )}
    </div>
  )
}
