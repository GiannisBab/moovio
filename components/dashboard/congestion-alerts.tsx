import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, AlertCircleIcon, ArrowRight01Icon, Clock01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link"
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
    label: "Critical",
    iconClass: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertCircleIcon,
    badge: "outline" as const,
    label: "Warning",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: InformationCircleIcon,
    badge: "secondary" as const,
    label: "Info",
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
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div>
          <CardTitle>Congestion Alerts</CardTitle>
          <CardDescription>Active incidents and warnings</CardDescription>
        </div>
        <CardAction>
          <Link
            href="/live-map"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {data.map((alert, index) => {
            const config = severityConfig[alert.severity]
            return (
              <div key={alert.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={config.icon}
                    className={cn("mt-0.5 size-4 shrink-0", config.iconClass)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {alert.location}
                      </span>
                      <Badge
                        variant={config.badge}
                        className={
                          alert.severity === "warning"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400"
                            : undefined
                        }
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      {alert.time}
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
