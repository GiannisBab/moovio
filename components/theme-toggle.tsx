"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon icon={Sun01Icon} className="size-4 dark:hidden" />
      <HugeiconsIcon icon={MoonIcon} className="hidden size-4 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
