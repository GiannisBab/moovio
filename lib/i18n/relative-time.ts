export function parseRelativeMinutes(text: string): number {
  const m = text.match(/(\d+)\s*min/)
  if (m) return Number(m[1])
  const h = text.match(/(\d+)\s*h/)
  if (h) return Number(h[1]) * 60
  return 999
}

export type RelativeTimeT = (
  key: "minAgo" | "hoursAgo" | "today" | "yesterday" | "daysAgo" | "weeksAgo",
  values?: Record<string, string | number>,
) => string

export function formatEnglishRelative(text: string, t: RelativeTimeT): string {
  const m = text.match(/(\d+)\s*min/)
  if (m) return t("minAgo", { count: Number(m[1]) })
  const h = text.match(/(\d+)\s*h(our)?/)
  if (h) return t("hoursAgo", { count: Number(h[1]) })
  return text
}
