"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  routePerformanceData,
  type RoutePerformance,
} from "@/lib/data/analytics-data"
import { cn } from "@/lib/utils"

type SortKey = keyof Omit<RoutePerformance, "id">
type SortDir = "asc" | "desc"

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Route" },
  { key: "trips", label: "Trips", align: "right" },
  { key: "avgSpeed", label: "Avg Speed (km/h)", align: "right" },
  { key: "delayMin", label: "Delay (min)", align: "right" },
  { key: "congestionScore", label: "Congestion", align: "right" },
]

function congestionVariant(score: number): "destructive" | "outline" | "secondary" {
  if (score >= 65) return "destructive"
  if (score >= 40) return "outline"
  return "secondary"
}

export function RoutePerformanceTable({ className }: { className?: string }) {
  const [sortKey, setSortKey] = React.useState<SortKey>("trips")
  const [sortDir, setSortDir] = React.useState<SortDir>("desc")

  const sorted = React.useMemo(() => {
    const rows = [...routePerformanceData]
    rows.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return rows
  }, [sortKey, sortDir])

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "name" ? "asc" : "desc")
    }
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Route Performance</CardTitle>
        <CardDescription>
          Top corridors by volume, speed, and delay
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "cursor-pointer select-none text-muted-foreground",
                    col.align === "right" && "text-right",
                  )}
                  onClick={() => onSort(col.key)}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      col.align === "right" && "justify-end",
                    )}
                  >
                    {col.label}
                    <HugeiconsIcon
                      icon={
                        sortKey === col.key
                          ? sortDir === "asc"
                            ? ArrowUp01Icon
                            : ArrowDown01Icon
                          : ArrowDataTransferHorizontalIcon
                      }
                      className={cn(
                        "size-3",
                        sortKey === col.key
                          ? "text-foreground"
                          : "text-muted-foreground/40",
                      )}
                    />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.trips.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.avgSpeed.toFixed(1)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.delayMin.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={congestionVariant(row.congestionScore)}>
                    {row.congestionScore}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
