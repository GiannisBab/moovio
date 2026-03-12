import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon } from "@hugeicons/core-free-icons";

export default function PredictionsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <HugeiconsIcon icon={AiBrain01Icon} className="size-12 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">AI Predictions</h2>
        <p className="text-muted-foreground">
          AI-powered mobility forecasting coming soon.
        </p>
      </div>
    </div>
  )
}
