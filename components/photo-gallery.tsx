"use client"

import { useCallback, useEffect, useState } from "react"
import { ImageIcon, Loader2, Sparkles } from "lucide-react"
import { GalleryImage } from "@/components/gallery-image"
import type { GalleryPhoto } from "@/components/gallery-types"
import { LightboxModal } from "@/components/lightbox-modal"

export function PhotoGallery() {
  const [images, setImages] = useState<GalleryPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getImageAltText = useCallback((image: GalleryPhoto, index: number) => {
    const uploadedDate = new Date(image.uploadedAt)

    if (Number.isNaN(uploadedDate.getTime())) {
      return `Celebration gallery photo ${index + 1}`
    }

    return `Celebration gallery photo ${index + 1}, uploaded on ${uploadedDate.toLocaleDateString()}`
  }, [])

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index)
    setZoomLevel(1)
    setIsModalOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setIsModalOpen(false)
    setSelectedIndex(null)
    setZoomLevel(1)
  }, [])

  const showPreviousImage = useCallback(() => {
    if (images.length === 0) {
      return
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return images.length - 1
      }

      return (currentIndex - 1 + images.length) % images.length
    })

    setZoomLevel(1)
  }, [images.length])

  const showNextImage = useCallback(() => {
    if (images.length === 0) {
      return
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return 0
      }

      return (currentIndex + 1) % images.length
    })

    setZoomLevel(1)
  }, [images.length])

  const handleImageZoom = useCallback(() => {
    setZoomLevel((currentZoom) => (currentZoom >= 2 ? 1 : currentZoom + 1))
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadGallery() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/gallery", {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.error || "Failed to load gallery")
        }

        const data = await response.json()
        setImages(Array.isArray(data.images) ? data.images : [])
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : "The gallery is not available right now.")
      } finally {
        setIsLoading(false)
      }
    }

    loadGallery()

    return () => controller.abort()
  }, [])

  return (
    <section className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <div className="flex items-center gap-2 text-[#C41E3A] uppercase tracking-[0.25em] text-xs">
          <Sparkles className="h-4 w-4" />
          Photo Gallery
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Memories from the celebration</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
          Photos uploaded from the upload page are stored in the photo gallery and shown here. Click on any photo to view it in full size, and use the navigation arrows to browse through the gallery.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-[#C41E3A]" />
          <p className="mt-3 text-sm">Loading gallery...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-dashed border-border bg-background/40 px-6 py-10 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-8 w-8 text-[#C41E3A]" />
          <p className="mt-3 text-sm">{error}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background/40 px-6 py-10 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-8 w-8 text-[#C41E3A]" />
          <p className="mt-3 text-sm">No photos have been uploaded yet.</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            Add the first image to the gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((image, index) => (
            <GalleryImage
              key={image.pathname}
              image={image}
              index={index}
              altText={getImageAltText(image, index)}
              onOpen={openLightbox}
            />
          ))}
        </div>
      )}

      <LightboxModal
        images={images}
        selectedIndex={selectedIndex}
        zoomLevel={zoomLevel}
        isOpen={isModalOpen}
        onClose={closeLightbox}
        onPrevious={showPreviousImage}
        onNext={showNextImage}
        onImageClick={handleImageZoom}
        getAltText={getImageAltText}
      />
    </section>
  )
}