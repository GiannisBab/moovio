"use client"

import * as React from "react"
import { NextIntlClientProvider } from "next-intl"
import enMessages from "@/messages/en.json"
import elMessages from "@/messages/el.json"
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config"
import { translateLabel } from "@/lib/i18n/data-labels"

const messagesByLocale = {
  en: enMessages,
  el: elMessages,
} as const

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

function readLocaleFromCookie(): Locale | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
  if (!match) return null
  const value = decodeURIComponent(match.split("=")[1] ?? "")
  return isLocale(value) ? value : null
}

function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${oneYear}; SameSite=Lax`
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = React.useState<Locale>(
    initialLocale ?? defaultLocale,
  )

  React.useEffect(() => {
    const cookieLocale = readLocaleFromCookie()
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale)
    }
  }, [locale])

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  const setLocale = React.useCallback((next: Locale) => {
    writeLocaleCookie(next)
    setLocaleState(next)
  }, [])

  const ctx = React.useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return (
    <LocaleContext.Provider value={ctx}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesByLocale[locale]}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = React.useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used inside <I18nProvider>")
  }
  return ctx
}

export function useDataLabel() {
  const { locale } = useLocale()
  return React.useCallback(
    (value: string) => translateLabel(locale, value),
    [locale],
  )
}
