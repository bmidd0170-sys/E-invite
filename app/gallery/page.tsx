"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PhotoGallery } from "@/components/photo-gallery"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />

      <div className="px-4 md:px-6 py-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to invite
            </Link>
          </div>

          <PhotoGallery />
        </div>
      </div>

      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />
    </main>
  )
}
