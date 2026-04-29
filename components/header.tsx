"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon, Alert01Icon, BarChartIcon, Calendar01Icon, Car01Icon, ConstructionIcon, DashboardCircleIcon, File02Icon, MapsIcon, Notification01Icon, OctagonIcon, Search01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useDataLabel } from "@/components/i18n-provider"
import {
  formatEnglishRelative,
  parseRelativeMinutes,
} from "@/lib/i18n/relative-time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { congestionAlerts } from "@/lib/data/dashboard-data"
import { incidents } from "@/lib/data/live-map-data"

const pageTitleKeys: Record<string, "dashboard" | "liveMap" | "analytics" | "reports" | "predictions"> = {
  "/": "dashboard",
  "/live-map": "liveMap",
  "/analytics": "analytics",
  "/reports": "reports",
  "/predictions": "predictions",
}

const pages = [
  { key: "dashboard" as const, href: "/", icon: DashboardCircleIcon },
  { key: "liveMap" as const, href: "/live-map", icon: MapsIcon },
  { key: "analytics" as const, href: "/analytics", icon: BarChartIcon },
  { key: "reports" as const, href: "/reports", icon: File02Icon },
  { key: "predictions" as const, href: "/predictions", icon: AiBrain01Icon },
]

const incidentIcons: Record<string, typeof Car01Icon> = {
  accident: Car01Icon,
  roadwork: ConstructionIcon,
  closure: OctagonIcon,
  event: Calendar01Icon,
}

const severityVariant: Record<string, "destructive" | "outline" | "secondary"> = {
  critical: "destructive",
  warning: "outline",
  info: "secondary",
}

type NotificationItem = {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  rawTime: string | null
  daysAgo: number | null
  icon: typeof Car01Icon
  href: string
  sortMinutes: number
}

const allNotifications: NotificationItem[] = [
  ...incidents.map<NotificationItem>((inc) => ({
    id: inc.id,
    title: inc.title,
    description: inc.location,
    severity: inc.severity,
    rawTime: inc.reportedAt,
    daysAgo: null,
    icon: incidentIcons[inc.type] ?? Shield01Icon,
    href: "/live-map",
    sortMinutes: parseRelativeMinutes(inc.reportedAt),
  })),
  ...congestionAlerts.map<NotificationItem>((alert) => ({
    id: alert.id,
    title: alert.location,
    description: `peak:${alert.peakHour}|dur:${alert.durationMin}`,
    severity: alert.severity,
    rawTime: null,
    daysAgo: alert.daysAgo,
    icon: Alert01Icon,
    href: "/",
    sortMinutes: alert.daysAgo * 24 * 60,
  })),
].sort((a, b) => a.sortMinutes - b.sortMinutes)

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("Header")
  const tSeverity = useTranslations("Severity")
  const tTime = useTranslations("RelativeTime")
  const tAlertText = useTranslations("AlertText")
  const dl = useDataLabel()
  const titleKey = pageTitleKeys[pathname] ?? "dashboard"
  const title = t(titleKey)

  const formatNotificationTime = (n: NotificationItem) => {
    if (n.daysAgo !== null) {
      if (n.daysAgo <= 0) return tTime("today")
      if (n.daysAgo === 1) return tTime("yesterday")
      if (n.daysAgo < 7) return tTime("daysAgo", { count: n.daysAgo })
      return tTime("weeksAgo", { count: Math.floor(n.daysAgo / 7) })
    }
    if (n.rawTime) return formatEnglishRelative(n.rawTime, tTime)
    return ""
  }

  const formatNotificationDescription = (n: NotificationItem) => {
    const m = n.description.match(/^peak:(.+)\|dur:(\d+)$/)
    if (m) {
      return tAlertText("peakDescription", { peak: m[1], duration: Number(m[2]) })
    }
    return dl(n.description)
  }
  const [searchOpen, setSearchOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleNotifications = allNotifications.filter(
    (n) => !dismissedIds.has(n.id)
  )
  const unreadCount = visibleNotifications.filter(
    (n) => !readIds.has(n.id)
  ).length

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSelect = useCallback(
    (href: string) => {
      setSearchOpen(false)
      router.push(href)
    },
    [router]
  )

  const handleMarkAllRead = useCallback(() => {
    setReadIds(new Set(visibleNotifications.map((n) => n.id)))
  }, [visibleNotifications])

  const handleClearAll = useCallback(() => {
    setDismissedIds(new Set(allNotifications.map((n) => n.id)))
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {pathname === "/" ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  {t("home")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {/* Search — icon-only on mobile, full bar on md+ */}
        <button
          onClick={() => setSearchOpen(true)}
          className="border-input bg-muted/40 text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center gap-2 rounded-md border text-sm transition-colors md:w-56 md:justify-start md:px-3"
        >
          <HugeiconsIcon icon={Search01Icon} className="size-3.5 shrink-0" />
          <span className="hidden flex-1 text-left md:inline">{t("search")}</span>
          <Kbd className="hidden md:inline">⌘K</Kbd>
        </button>

        <CommandDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          title={t("searchTitle")}
          description={t("searchDescription")}
        >
          <Command>
            <CommandInput placeholder={t("searchPlaceholder")} />
            <CommandList>
              <CommandEmpty>{t("noResults")}</CommandEmpty>
              <CommandGroup heading={t("groupPages")}>
                {pages.map((page) => (
                  <CommandItem
                    key={page.href}
                    onSelect={() => handleSelect(page.href)}
                  >
                    <HugeiconsIcon icon={page.icon} className="size-4" />
                    {t(page.key)}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading={t("groupCongestion")}>
                {congestionAlerts.map((alert) => (
                  <CommandItem
                    key={alert.id}
                    onSelect={() => handleSelect("/")}
                  >
                    <HugeiconsIcon icon={Alert01Icon} className="size-4" />
                    <div className="flex flex-col">
                      <span>{dl(alert.location)}</span>
                      <span className="text-muted-foreground text-xs">
                        {tAlertText("peakDescription", {
                          peak: alert.peakHour,
                          duration: alert.durationMin,
                        })}
                      </span>
                    </div>
                    <Badge
                      variant={severityVariant[alert.severity]}
                      className="ml-auto"
                    >
                      {tSeverity(alert.severity)}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading={t("groupIncidents")}>
                {incidents.map((inc) => {
                  const icon = incidentIcons[inc.type] ?? Shield01Icon
                  return (
                    <CommandItem
                      key={inc.id}
                      onSelect={() => handleSelect("/live-map")}
                    >
                      <HugeiconsIcon icon={icon} className="size-4" />
                      <div className="flex flex-col">
                        <span>{dl(inc.title)}</span>
                        <span className="text-muted-foreground text-xs">
                          {dl(inc.location)}
                        </span>
                      </div>
                      <Badge
                        variant={severityVariant[inc.severity]}
                        className="ml-auto"
                      >
                        {tSeverity(inc.severity)}
                      </Badge>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative"
              />
            }
          >
            <HugeiconsIcon icon={Notification01Icon} className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 gap-0 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">{t("notifications")}</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("markAllRead")}
                  </button>
                )}
                {visibleNotifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("clearAll")}
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <HugeiconsIcon icon={Notification01Icon} className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">{t("noNotifications")}</p>
                </div>
              ) : (
                visibleNotifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setReadIds((prev) => new Set(prev).add(n.id))
                      router.push(n.href)
                    }}
                    className={cn(
                      "hover:bg-muted flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-0",
                      readIds.has(n.id) && "opacity-60"
                    )}
                  >
                    <HugeiconsIcon icon={n.icon} className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {dl(n.title)}
                        </span>
                        <Badge
                          variant={severityVariant[n.severity]}
                          className="shrink-0"
                        >
                          {tSeverity(n.severity)}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground truncate text-xs">
                        {formatNotificationDescription(n)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatNotificationTime(n)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
