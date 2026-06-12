"use client"

import { useEffect, useState } from "react"
import { ImageIcon, Loader2, Sparkles } from "lucide-react"

type GalleryImage = {
  url: string
  pathname: string
  uploadedAt: string
}

export function PhotoGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          Photos uploaded from the admin page are stored in Blob and shown here on the invite.
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
            Add the first image from the upload page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((image) => (
            <figure
              key={image.pathname}
              className="group overflow-hidden rounded-xl border border-[#C41E3A]/70 bg-background shadow-lg shadow-black/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={image.url}
                  alt="Uploaded gallery photo"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
              </div>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}