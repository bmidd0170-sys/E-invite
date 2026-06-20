"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import type { GalleryPhoto } from "@/components/gallery-types"
import { isGalleryVideo } from "@/components/gallery-types"

type GalleryImageProps = {
  image: GalleryPhoto
  index: number
  altText: string
  onOpen: (index: number) => void
}

export function GalleryImage({ image, index, altText, onOpen }: GalleryImageProps) {
  const isVideo = isGalleryVideo(image)

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open ${isVideo ? "video" : "photo"} ${index + 1} in fullscreen view`}
      className="group block w-full overflow-hidden rounded-xl border border-[#C41E3A]/70 bg-background text-left shadow-lg shadow-black/20"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {isVideo ? (
          <>
            <video
              src={image.url}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-black/55 text-white">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </div>
          </>
        ) : (
          <Image
            src={image.url}
            alt={altText}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
      </div>
    </button>
  )
}
