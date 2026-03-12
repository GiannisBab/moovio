import { HugeiconsIcon } from "@hugeicons/react";
import { Car01Icon, DashboardSpeedIcon, Leaf01Icon, Route01Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import type { KpiItem } from "@/lib/data/dashboard-data"

const iconMap = {
  Route: Route01Icon,
  Car: Car01Icon,
  Gauge: DashboardSpeedIcon,
  Leaf: Leaf01Icon,
} as const

export function KpiCards({ data }: { data: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {data.map((item) => {
        const icon = iconMap[item.icon]
        return (
          <Card key={item.title} size="sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {item.changeType === "positive" ? (
                  <HugeiconsIcon icon={TradeUpIcon} className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <HugeiconsIcon icon={TradeDownIcon} className="size-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={
                    item.changeType === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {item.change}
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
