import { Map } from "lucide-react"

export default function LiveMapPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <Map className="size-12 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">Live Map</h2>
        <p className="text-muted-foreground">
          Real-time traffic visualization coming soon.
        </p>
      </div>
    </div>
  )
}
