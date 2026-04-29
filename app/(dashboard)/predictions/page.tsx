"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";

export default function PredictionsPage() {
  const t = useTranslations("Predictions")
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <HugeiconsIcon icon={AiBrain01Icon} className="size-12 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>
    </div>
  )
}
