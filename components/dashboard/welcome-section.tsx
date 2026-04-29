"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl"
import type { CongestionAlert } from "@/lib/data/dashboard-data"

function greetingKeyForHour(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}

export function WelcomeSection({ alerts }: { alerts: CongestionAlert[] }) {
  const t = useTranslations("Welcome")
  const [greeting, setGreeting] = React.useState(t("fallback"))

  React.useEffect(() => {
    setGreeting(t(greetingKeyForHour(new Date().getHours())))
  }, [t])

  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{greeting}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        {criticalCount > 0 && (
          <>
            <HugeiconsIcon icon={Alert01Icon} className="size-3.5 text-red-600 dark:text-red-400" />
            <span>{t("criticalAlerts", { count: criticalCount })}</span>
          </>
        )}
        {criticalCount > 0 && warningCount > 0 && (
          <span className="mx-1">&middot;</span>
        )}
        {warningCount > 0 && (
          <span>{t("warningsActive", { count: warningCount })}</span>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <span>{t("allNormal")}</span>
        )}
      </p>
    </div>
  )
}
