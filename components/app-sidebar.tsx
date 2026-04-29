"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon, BarChartIcon, DashboardCircleIcon, File02Icon, MapsIcon } from "@hugeicons/core-free-icons";
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
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslations } from "next-intl"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const navItems = [
  { key: "dashboard", href: "/", icon: DashboardCircleIcon },
  { key: "liveMap", href: "/live-map", icon: MapsIcon },
  { key: "analytics", href: "/analytics", icon: BarChartIcon },
  { key: "reports", href: "/reports", icon: File02Icon },
  { key: "predictions", href: "/predictions", icon: AiBrain01Icon },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations("Nav")

  return (
    <TooltipProvider>
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
            {t("section")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                const label = t(item.key)
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={label}
                      className={cn(
                        "h-9 gap-3 rounded-lg px-3 font-normal tracking-[-0.01em] text-sidebar-foreground/70 transition-[background-color,color] duration-150 ease-out-quart",
                        active &&
                          "bg-sidebar-accent/80 font-medium text-sidebar-accent-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={item.icon} className={cn(
                                                      "size-[18px] shrink-0 transition-colors duration-150 ease-out-quart",
                                                      active
                                                        ? "text-sidebar-accent-foreground"
                                                        : "text-sidebar-foreground/50"
                                                    )} strokeWidth={1.75} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    </TooltipProvider>
  )
}
