"use client"

import Image from "next/image"
import type { GalleryPhoto } from "@/components/gallery-types"

type GalleryImageProps = {
  image: GalleryPhoto
  index: number
  altText: string
  onOpen: (index: number) => void
}

export function GalleryImage({ image, index, altText, onOpen }: GalleryImageProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} in fullscreen view`}
      className="group block w-full overflow-hidden rounded-xl border border-[#C41E3A]/70 bg-background text-left shadow-lg shadow-black/20"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image.url}
          alt={altText}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
      </div>
    </button>
  )
}
