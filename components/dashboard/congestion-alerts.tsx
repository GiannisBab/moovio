"use client"

import type { CSSProperties } from "react"
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, AlertCircleIcon, ArrowRight01Icon, Clock01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useDataLabel } from "@/components/i18n-provider"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CongestionAlert } from "@/lib/data/dashboard-data"
import { cn } from "@/lib/utils"

const severityConfig = {
  critical: {
    icon: Alert01Icon,
    badge: "destructive" as const,
    labelKey: "critical" as const,
    iconClass: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertCircleIcon,
    badge: "outline" as const,
    labelKey: "warning" as const,
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: InformationCircleIcon,
    badge: "secondary" as const,
    labelKey: "info" as const,
    iconClass: "text-blue-600 dark:text-blue-400",
  },
}

export function CongestionAlerts({
  data,
  className,
}: {
  data: CongestionAlert[]
  className?: string
}) {
  const t = useTranslations("CongestionAlerts")
  const tAlertText = useTranslations("AlertText")
  const tTime = useTranslations("RelativeTime")
  const dl = useDataLabel()

  const formatRelative = (daysAgo: number) => {
    if (daysAgo <= 0) return tTime("today")
    if (daysAgo === 1) return tTime("yesterday")
    if (daysAgo < 7) return tTime("daysAgo", { count: daysAgo })
    return tTime("weeksAgo", { count: Math.floor(daysAgo / 7) })
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <CardAction>
          <Link
            href="/live-map"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {data.map((alert, index) => {
            const config = severityConfig[alert.severity]
            return (
              <div
                key={alert.id}
                className="stagger-item"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={config.icon}
                    className={cn("mt-0.5 size-4 shrink-0", config.iconClass)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {dl(alert.location)}
                      </span>
                      <Badge
                        variant={config.badge}
                        className={
                          alert.severity === "warning"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400"
                            : undefined
                        }
                      >
                        {t(config.labelKey)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tAlertText("peakDescription", {
                        peak: alert.peakHour,
                        duration: alert.durationMin,
                      })}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      {formatRelative(alert.daysAgo)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
