"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon, BarChartIcon, DashboardCircleIcon, GithubIcon, MapsIcon } from "@hugeicons/core-free-icons";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/", icon: DashboardCircleIcon },
  { title: "Live Map", href: "/live-map", icon: MapsIcon },
  { title: "Analytics", href: "/analytics", icon: BarChartIcon },
  { title: "Predictions", href: "/predictions", icon: AiBrain01Icon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Link href="/" className="flex items-center group-data-[collapsible=icon]:hidden">
            <Logo className="h-7 w-auto" />
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      className={cn(
                        "h-9 gap-3 rounded-lg px-3 font-normal tracking-[-0.01em] text-sidebar-foreground/70 transition-all duration-150",
                        active &&
                          "bg-sidebar-accent/80 font-medium text-sidebar-accent-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={item.icon} className={cn(
                                                      "size-[18px] shrink-0",
                                                      active
                                                        ? "text-sidebar-accent-foreground"
                                                        : "text-sidebar-foreground/50"
                                                    )} strokeWidth={active ? 2 : 1.5} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-2">
          <a
            href="https://github.com/GiannisBab/moovio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <HugeiconsIcon icon={GithubIcon} className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
