"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type DashboardRange = "today" | "week" | "month"

const ranges: { value: DashboardRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

type Props = {
  value: DashboardRange
  onChange: (value: DashboardRange) => void
}

export function TimeRangeSelector({ value, onChange }: Props) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(val) => {
        if (val.length > 0) onChange(val[0] as DashboardRange)
      }}
      variant="outline"
      size="sm"
    >
      {ranges.map((r) => (
        <ToggleGroupItem key={r.value} value={r.value}>
          {r.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
