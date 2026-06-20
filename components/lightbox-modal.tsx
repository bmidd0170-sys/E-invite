"use client"

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react"
import Image from "next/image"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import type { GalleryPhoto } from "@/components/gallery-types"
import { isGalleryVideo } from "@/components/gallery-types"
import { NavigationControls } from "@/components/navigation-controls"

type LightboxModalProps = {
  images: GalleryPhoto[]
  selectedIndex: number | null
  zoomLevel: number
  isOpen: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onImageClick: () => void
  getAltText: (image: GalleryPhoto, index: number) => string
}

export function LightboxModal({
  images,
  selectedIndex,
  zoomLevel,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onImageClick,
  getAltText,
}: LightboxModalProps) {
  const currentImage = selectedIndex === null ? null : images[selectedIndex]
  const isVideo = currentImage ? isGalleryVideo(currentImage) : false
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 5)
  const [transformOrigin, setTransformOrigin] = useState("50% 50%")

  useEffect(() => {
    if (!isOpen || selectedIndex === null) {
      return
    }

    // Reset while the next item loads so the container never stretches unexpectedly.
    setImageAspectRatio(4 / 5)
    setTransformOrigin("50% 50%")
  }, [isOpen, selectedIndex, isVideo])

  const handleImageClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isVideo) {
      return
    }

    if (zoomLevel === 1) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      setTransformOrigin(`${x}% ${y}%`)
    }

    onImageClick()
  }

  useEffect(() => {
    if (zoomLevel !== 1) {
      return
    }

    // Keep the previous origin during zoom-out, then recenter once the animation finishes.
    const timeoutId = window.setTimeout(() => {
      setTransformOrigin("50% 50%")
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [zoomLevel])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        onPrevious()
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        onNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onNext, onPrevious])

  if (!currentImage || selectedIndex === null) {
    return null
  }

  const frameStyle = {
    width: "min(92vw, calc(80vh * var(--lightbox-image-ratio)))",
    height: "min(80vh, calc(92vw / var(--lightbox-image-ratio)))",
    ["--lightbox-image-ratio" as const]: imageAspectRatio,
  } satisfies CSSProperties & { "--lightbox-image-ratio": number }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:p-8"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <DialogPrimitive.Title className="sr-only">{isVideo ? "Video lightbox" : "Photo lightbox"}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Fullscreen {isVideo ? "video" : "photo"} view with keyboard navigation. Press left or right arrows to change
            items and press Escape to close.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            aria-label="Close lightbox"
            className="absolute right-4 top-4 z-50 rounded-full border border-border bg-black/70 p-2 text-white transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] md:right-6 md:top-6"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          <NavigationControls onPrevious={onPrevious} onNext={onNext} />

          <div className="relative flex max-h-[80vh] w-full flex-col items-center justify-center">
            <div
              className="relative overflow-hidden rounded-xl border border-border bg-black/40"
              style={frameStyle}
            >
              {isVideo ? (
                <video
                  key={currentImage.url}
                  src={currentImage.url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                  onLoadedMetadata={(event) => {
                    const loadedVideo = event.currentTarget

                    if (loadedVideo.videoWidth > 0 && loadedVideo.videoHeight > 0) {
                      setImageAspectRatio(loadedVideo.videoWidth / loadedVideo.videoHeight)
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleImageClick}
                  aria-label={zoomLevel === 1 ? "Zoom in image" : "Reset image zoom"}
                  className="relative h-full w-full"
                  style={{ cursor: zoomLevel === 1 ? "zoom-in" : "zoom-out" }}
                >
                  <Image
                    src={currentImage.url}
                    alt={getAltText(currentImage, selectedIndex)}
                    fill
                    priority
                    draggable={false}
                    sizes="(max-width: 768px) 92vw, 1200px"
                    className="select-none object-contain transition-transform duration-300 ease-in-out"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin, transition: "transform 0.3s ease" }}
                    onLoad={(event) => {
                      const loadedImage = event.currentTarget

                      if (loadedImage.naturalWidth > 0 && loadedImage.naturalHeight > 0) {
                        setImageAspectRatio(loadedImage.naturalWidth / loadedImage.naturalHeight)
                      }
                    }}
                  />
                </button>
              )}
            </div>
            <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
