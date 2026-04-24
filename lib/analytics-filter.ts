import { subDays, startOfDay, endOfDay } from "date-fns"

export const REFERENCE_TODAY = new Date("2026-04-24T00:00:00Z")

export type AnalyticsPreset = "24h" | "7d" | "30d" | "90d" | "custom"

export type AnalyticsRange = {
  from: Date
  to: Date
}

export type AnalyticsFilter = {
  preset: AnalyticsPreset
  range: AnalyticsRange
}

export const PRESET_OPTIONS: { value: Exclude<AnalyticsPreset, "custom">; label: string; days: number }[] = [
  { value: "24h", label: "24h", days: 1 },
  { value: "7d", label: "7d", days: 7 },
  { value: "30d", label: "30d", days: 30 },
  { value: "90d", label: "90d", days: 90 },
]

export function resolvePreset(preset: Exclude<AnalyticsPreset, "custom">): AnalyticsRange {
  const opt = PRESET_OPTIONS.find((p) => p.value === preset)!
  return {
    from: startOfDay(subDays(REFERENCE_TODAY, opt.days - 1)),
    to: endOfDay(REFERENCE_TODAY),
  }
}

export const DEFAULT_FILTER: AnalyticsFilter = {
  preset: "30d",
  range: resolvePreset("30d"),
}

export function inRange(dateStr: string, range: AnalyticsRange): boolean {
  const d = new Date(`${dateStr}T00:00:00Z`).getTime()
  return d >= range.from.getTime() && d <= range.to.getTime()
}

export function rangeDays(range: AnalyticsRange): number {
  return Math.max(
    1,
    Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)),
  )
}
