"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  BarChart3,
  BrainCircuit,
  Github,
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Live Map", href: "/live-map", icon: Map },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Predictions", href: "/predictions", icon: BrainCircuit },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center px-2 py-1">
          <Logo className="h-7 w-auto" />
        </Link>
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
                      <item.icon
                        className={cn(
                          "size-[18px] shrink-0",
                          active
                            ? "text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/50"
                        )}
                        strokeWidth={active ? 2 : 1.5}
                      />
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
            <Github className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
