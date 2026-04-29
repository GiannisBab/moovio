"use client"

import { useTranslations } from "next-intl"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type DashboardRange = "today" | "week" | "month"

const RANGES: DashboardRange[] = ["today", "week", "month"]

type Props = {
  value: DashboardRange
  onChange: (value: DashboardRange) => void
}

export function TimeRangeSelector({ value, onChange }: Props) {
  const t = useTranslations("TimeRange")
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(val) => {
        if (val.length > 0) onChange(val[0] as DashboardRange)
      }}
      variant="outline"
      size="sm"
    >
      {RANGES.map((r) => (
        <ToggleGroupItem key={r} value={r}>
          {t(r)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
