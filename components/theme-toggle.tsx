"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    const doc = document as DocumentWithViewTransitions

    if (typeof doc.startViewTransition !== "function") {
      setTheme(next)
      return
    }

    doc.startViewTransition(() => {
      setTheme(next)
    })
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle}>
      <span className="relative inline-flex size-4 items-center justify-center">
        <HugeiconsIcon
          icon={Sun01Icon}
          className="absolute size-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-200 ease-out-quart dark:-rotate-90 dark:scale-75 dark:opacity-0"
        />
        <HugeiconsIcon
          icon={MoonIcon}
          className="absolute size-4 rotate-90 scale-75 opacity-0 transition-[transform,opacity] duration-200 ease-out-quart dark:rotate-0 dark:scale-100 dark:opacity-100"
        />
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
