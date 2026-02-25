"use client"

import { useRef, useEffect, useState } from "react"
import { MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map"
import type { TrafficCamera } from "@/lib/data/live-map-data"
import { Video, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Hls from "hls.js"

function usePopupVisibility(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [containerRef])

  return visible
}

function HlsPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setError(false)

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
      })
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError(true)
      })

      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {})
      })
      return () => {
        video.removeAttribute("src")
        video.load()
      }
    } else {
      setError(true)
    }
  }, [url])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded text-xs text-muted-foreground">
        Stream unavailable
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      className="w-full h-full object-cover rounded"
    />
  )
}

export function CameraFeedMarkers({
  cameras,
}: {
  cameras: TrafficCamera[]
}) {
  return (
    <>
      {cameras.map((camera) => (
        <CameraMarker key={camera.id} camera={camera} />
      ))}
    </>
  )
}

function CameraPopupContent({ camera }: { camera: TrafficCamera }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const visible = usePopupVisibility(containerRef)

  // Increment key each time popup becomes visible to force a fresh HLS mount
  const [playerKey, setPlayerKey] = useState(0)
  const prevVisible = useRef(false)
  useEffect(() => {
    if (visible && !prevVisible.current) {
      setPlayerKey((k) => k + 1)
    }
    prevVisible.current = visible
  }, [visible])

  return (
    <div ref={containerRef} className="w-72 space-y-2 pr-5">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center size-7 rounded-full bg-sky-500/10">
          <Video className="size-4 text-sky-500" />
        </div>
        <div>
          <p className="text-sm font-semibold">{camera.name}</p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <ArrowUpRight className="size-3" />
            {camera.direction}
          </p>
        </div>
      </div>
      <div className="aspect-video bg-black rounded overflow-hidden">
        {visible ? (
          <HlsPlayer key={playerKey} url={camera.streamUrl} />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            <Video className="size-4 opacity-50" />
          </div>
        )}
      </div>
    </div>
  )
}

function CameraMarker({ camera }: { camera: TrafficCamera }) {
  return (
    <MapMarker
      longitude={camera.longitude}
      latitude={camera.latitude}
    >
      <MarkerContent>
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-30" />
          <div
            className={cn(
              "flex items-center justify-center size-8 rounded-full shadow-lg border-2 border-white",
              "bg-sky-600"
            )}
          >
            <Video className="size-4 text-white" />
          </div>
        </div>
      </MarkerContent>
      <MarkerPopup closeButton>
        <CameraPopupContent camera={camera} />
      </MarkerPopup>
    </MapMarker>
  )
}
