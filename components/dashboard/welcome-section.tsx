"use client"

import { AlertTriangle } from "lucide-react"
import type { CongestionAlert } from "@/lib/data/dashboard-data"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function WelcomeSection({ alerts }: { alerts: CongestionAlert[] }) {
  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{getGreeting()}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        {criticalCount > 0 && (
          <>
            <AlertTriangle className="size-3.5 text-red-600 dark:text-red-400" />
            <span>
              {criticalCount} critical alert{criticalCount !== 1 ? "s" : ""} need
              {criticalCount === 1 ? "s" : ""} attention
            </span>
          </>
        )}
        {criticalCount > 0 && warningCount > 0 && (
          <span className="mx-1">&middot;</span>
        )}
        {warningCount > 0 && (
          <span>
            {warningCount} warning{warningCount !== 1 ? "s" : ""} active
          </span>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <span>All systems operating normally</span>
        )}
      </p>
    </div>
  )
}
