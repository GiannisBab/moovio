import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <BarChart3 className="size-12 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground">
          Deep-dive mobility analytics coming soon.
        </p>
      </div>
    </div>
  )
}
