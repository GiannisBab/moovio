"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { LanguageSkillIcon, Tick01Icon } from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/components/i18n-provider"
import { locales, type Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

const LABEL_KEYS: Record<Locale, "english" | "greek"> = {
  en: "english",
  el: "greek",
}

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()
  const t = useTranslations("Language")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("label")}
          />
        }
      >
        <HugeiconsIcon icon={LanguageSkillIcon} className="size-4" />
        <span className="sr-only">{t("label")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {locales.map((l) => {
          const active = l === locale
          return (
            <DropdownMenuItem key={l} onClick={() => setLocale(l)}>
              <span className="flex-1">{t(LABEL_KEYS[l])}</span>
              <HugeiconsIcon
                icon={Tick01Icon}
                className={cn(
                  "size-3.5 transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
