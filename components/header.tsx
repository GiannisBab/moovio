"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  Car,
  Construction,
  BarChart3,
  LayoutDashboard,
  Map,
  OctagonX,
  Search,
  ShieldAlert,
  CalendarClock,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
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
import { congestionAlerts } from "@/lib/data/dashboard-data"
import { incidents } from "@/lib/data/live-map-data"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/live-map": "Live Map",
  "/analytics": "Analytics & Reports",
  "/predictions": "AI Predictions",
}

const pages = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Live Map", href: "/live-map", icon: Map },
  { title: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
  { title: "AI Predictions", href: "/predictions", icon: BrainCircuit },
]

const incidentIcons: Record<string, typeof Car> = {
  accident: Car,
  roadwork: Construction,
  closure: OctagonX,
  event: CalendarClock,
}

const severityVariant: Record<string, "destructive" | "outline" | "secondary"> = {
  critical: "destructive",
  warning: "outline",
  info: "secondary",
}

const notifications = [
  ...incidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    description: inc.location,
    severity: inc.severity,
    time: inc.reportedAt,
    icon: incidentIcons[inc.type] ?? ShieldAlert,
    href: "/live-map",
  })),
  ...congestionAlerts.map((alert) => ({
    id: alert.id,
    title: alert.location,
    description: alert.description,
    severity: alert.severity,
    time: alert.time,
    icon: AlertTriangle,
    href: "/",
  })),
].sort((a, b) => {
  // rough sort: "min ago" < "hour ago"
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

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="border-input bg-muted/40 text-muted-foreground hover:bg-muted flex h-8 w-56 items-center gap-2 rounded-md border px-3 text-sm transition-colors"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <Kbd>⌘K</Kbd>
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
                    <page.icon className="size-4" />
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
                    <AlertTriangle className="size-4" />
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
                  const Icon = incidentIcons[inc.type] ?? ShieldAlert
                  return (
                    <CommandItem
                      key={inc.id}
                      onSelect={() => handleSelect("/live-map")}
                    >
                      <Icon className="size-4" />
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
            <Bell className="size-4" />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 gap-0 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <Badge variant="secondary">{notifications.length}</Badge>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => router.push(n.href)}
                  className="hover:bg-muted flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-0"
                >
                  <n.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
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
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
