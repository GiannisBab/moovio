export type CsvColumn<T> = {
  key: keyof T & string
  header: string
  format?: (value: T[keyof T], row: T) => string | number
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  columns: CsvColumn<T>[],
  rows: T[],
) {
  const header = columns.map((c) => escapeCell(c.header)).join(",")
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = c.format ? c.format(row[c.key], row) : row[c.key]
          return escapeCell(raw)
        })
        .join(","),
    )
    .join("\n")

  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
