"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export type ReportColumn<T> = {
  key: keyof T & string
  header: string
  align?: "right"
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

type Props<T extends { id: string | number }> = {
  columns: ReportColumn<T>[]
  rows: T[]
  pageSize?: number
  initialSortKey?: keyof T & string
  initialSortDir?: "asc" | "desc"
  emptyMessage?: string
}

export function ReportTable<T extends { id: string | number }>({
  columns,
  rows,
  pageSize = 10,
  initialSortKey,
  initialSortDir = "desc",
  emptyMessage = "No records",
}: Props<T>) {
  const firstSortable = columns.find((c) => c.sortable !== false)?.key
  const [sortKey, setSortKey] = React.useState<(keyof T & string) | undefined>(
    initialSortKey ?? firstSortable,
  )
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(initialSortDir)
  const [page, setPage] = React.useState(0)

  React.useEffect(() => {
    setPage(0)
  }, [rows])

  const sorted = React.useMemo(() => {
    if (!sortKey) return rows
    const out = [...rows]
    out.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av == null && bv == null) return 0
      if (av == null) return sortDir === "asc" ? -1 : 1
      if (bv == null) return sortDir === "asc" ? 1 : -1
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return out
  }, [rows, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)

  const onSort = (key: keyof T & string, sortable: boolean | undefined) => {
    if (sortable === false) return
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const visiblePages = React.useMemo(() => {
    const pages: number[] = []
    const start = Math.max(0, safePage - 2)
    const end = Math.min(pageCount, start + 5)
    for (let i = start; i < end; i++) pages.push(i)
    return pages
  }, [safePage, pageCount])

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-md ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {columns.map((col) => {
                const isSortable = col.sortable !== false
                const isActive = sortKey === col.key
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "text-muted-foreground",
                      isSortable && "cursor-pointer select-none",
                      col.align === "right" && "text-right",
                    )}
                    onClick={() => onSort(col.key, col.sortable)}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1",
                        col.align === "right" && "justify-end",
                      )}
                    >
                      {col.header}
                      {isSortable && (
                        <HugeiconsIcon
                          icon={
                            isActive
                              ? sortDir === "asc"
                                ? ArrowUp01Icon
                                : ArrowDown01Icon
                              : ArrowDataTransferHorizontalIcon
                          }
                          className={cn(
                            "size-3",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground/40",
                          )}
                        />
                      )}
                    </span>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {visible.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      col.align === "right" && "text-right tabular-nums",
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <span className="text-xs text-muted-foreground">
          Showing {sorted.length === 0 ? 0 : safePage * pageSize + 1}–
          {Math.min(sorted.length, (safePage + 1) * pageSize)} of {sorted.length}
        </span>
        {pageCount > 1 && (
          <Pagination className="sm:mx-0 sm:w-auto sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={safePage === 0}
                  className={cn(
                    safePage === 0 && "pointer-events-none opacity-50",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(0, p - 1))
                  }}
                />
              </PaginationItem>
              {visiblePages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === safePage}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(p)
                    }}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={safePage >= pageCount - 1}
                  className={cn(
                    safePage >= pageCount - 1 && "pointer-events-none opacity-50",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(pageCount - 1, p + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
