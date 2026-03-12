"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon, Alert01Icon, BarChartIcon, Calendar01Icon, Car01Icon, ConstructionIcon, DashboardCircleIcon, MapsIcon, Notification01Icon, OctagonIcon, Search01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/live-map": "Live Map",
  "/analytics": "Analytics & Reports",
  "/predictions": "AI Predictions",
}

const pages = [
  { title: "Dashboard", href: "/", icon: DashboardCircleIcon },
  { title: "Live Map", href: "/live-map", icon: MapsIcon },
  { title: "Analytics & Reports", href: "/analytics", icon: BarChartIcon },
  { title: "AI Predictions", href: "/predictions", icon: AiBrain01Icon },
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

const allNotifications = [
  ...incidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    description: inc.location,
    severity: inc.severity,
    time: inc.reportedAt,
    icon: incidentIcons[inc.type] ?? Shield01Icon,
    href: "/live-map",
  })),
  ...congestionAlerts.map((alert) => ({
    id: alert.id,
    title: alert.location,
    description: alert.description,
    severity: alert.severity,
    time: alert.time,
    icon: Alert01Icon,
    href: "/",
  })),
].sort((a, b) => {
  const extractMinutes = (t: string) => {
    const m = t.match(/(\d+)\s*min/)
    const h = t.match(/(\d+)\s*h/)
    return m ? Number(m[1]) : h ? Number(h[1]) * 60 : 999
  }
  return extractMinutes(a.time) - extractMinutes(b.time)
})

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const title = pageTitles[pathname] ?? "Dashboard"
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  Home
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
          <span className="hidden flex-1 text-left md:inline">Search...</span>
          <Kbd className="hidden md:inline">⌘K</Kbd>
        </button>

        <CommandDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          title="Search"
          description="Search pages, alerts, and incidents"
        >
          <Command>
            <CommandInput placeholder="Type to search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Pages">
                {pages.map((page) => (
                  <CommandItem
                    key={page.href}
                    onSelect={() => handleSelect(page.href)}
                  >
                    <HugeiconsIcon icon={page.icon} className="size-4" />
                    {page.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Congestion Alerts">
                {congestionAlerts.map((alert) => (
                  <CommandItem
                    key={alert.id}
                    onSelect={() => handleSelect("/")}
                  >
                    <HugeiconsIcon icon={Alert01Icon} className="size-4" />
                    <div className="flex flex-col">
                      <span>{alert.location}</span>
                      <span className="text-muted-foreground text-xs">
                        {alert.description}
                      </span>
                    </div>
                    <Badge
                      variant={severityVariant[alert.severity]}
                      className="ml-auto"
                    >
                      {alert.severity}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Incidents">
                {incidents.map((inc) => {
                  const icon = incidentIcons[inc.type] ?? Shield01Icon
                  return (
                    <CommandItem
                      key={inc.id}
                      onSelect={() => handleSelect("/live-map")}
                    >
                      <HugeiconsIcon icon={icon} className="size-4" />
                      <div className="flex flex-col">
                        <span>{inc.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {inc.location}
                        </span>
                      </div>
                      <Badge
                        variant={severityVariant[inc.severity]}
                        className="ml-auto"
                      >
                        {inc.severity}
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
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Mark all read
                  </button>
                )}
                {visibleNotifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <HugeiconsIcon icon={Notification01Icon} className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No notifications</p>
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
                          {n.title}
                        </span>
                        <Badge
                          variant={severityVariant[n.severity]}
                          className="shrink-0"
                        >
                          {n.severity}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground truncate text-xs">
                        {n.description}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {n.time}
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
