"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ranges = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

export function TimeRangeSelector() {
  const [value, setValue] = useState("today")

  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(val) => {
        if (val.length > 0) setValue(val[0])
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
