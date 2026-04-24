"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  PRESET_OPTIONS,
  REFERENCE_TODAY,
  resolvePreset,
  type AnalyticsFilter,
  type AnalyticsPreset,
} from "@/lib/analytics-filter"

type Props = {
  value: AnalyticsFilter
  onChange: (next: AnalyticsFilter) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: Props) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange | undefined>({
    from: value.range.from,
    to: value.range.to,
  })
  const pendingChangeRef = React.useRef<AnalyticsFilter | null>(null)

  React.useEffect(() => {
    if (open) {
      setDraft({ from: value.range.from, to: value.range.to })
    }
  }, [open, value.range.from, value.range.to])

  const label =
    value.preset === "custom"
      ? `${format(value.range.from, "MMM d")} – ${format(value.range.to, "MMM d, yyyy")}`
      : `Last ${PRESET_OPTIONS.find((p) => p.value === value.preset)?.label}`

  const applyPreset = (preset: Exclude<AnalyticsPreset, "custom">) => {
    if (preset !== value.preset) {
      pendingChangeRef.current = { preset, range: resolvePreset(preset) }
    }
    setOpen(false)
  }

  const applyCustom = () => {
    if (draft?.from && draft.to) {
      pendingChangeRef.current = {
        preset: "custom",
        range: { from: draft.from, to: draft.to },
      }
      setOpen(false)
    }
  }

  const handleOpenChangeComplete = (isOpen: boolean) => {
    if (!isOpen && pendingChangeRef.current) {
      onChange(pendingChangeRef.current)
      pendingChangeRef.current = null
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("justify-start font-normal", className)}
          />
        }
      >
        <HugeiconsIcon icon={Calendar01Icon} data-icon="inline-start" />
        {label}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-auto gap-0 p-0"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row gap-1 border-b p-2 sm:flex-col sm:border-r sm:border-b-0">
            {PRESET_OPTIONS.map((p) => (
              <Button
                key={p.value}
                variant={value.preset === p.value ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => applyPreset(p.value)}
              >
                Last {p.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-col">
            <Calendar
              mode="range"
              numberOfMonths={2}
              defaultMonth={value.range.from}
              selected={draft}
              onSelect={setDraft}
              disabled={{ after: REFERENCE_TODAY }}
            />
            <div className="flex items-center justify-between border-t px-3 py-2">
              <span className="text-xs text-muted-foreground">
                {draft?.from && draft.to
                  ? `${format(draft.from, "MMM d")} – ${format(draft.to, "MMM d, yyyy")}`
                  : "Select a range"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!draft?.from || !draft.to}
                  onClick={applyCustom}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
