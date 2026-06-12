"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

type NavigationControlsProps = {
  onPrevious: () => void
  onNext: () => void
}

export function NavigationControls({ onPrevious, onNext }: NavigationControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        aria-label="View previous image"
        className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-full border border-border bg-black/65 p-2 text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] md:left-6 md:p-3"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="View next image"
        className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-full border border-border bg-black/65 p-2 text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] md:right-6 md:p-3"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </>
  )
}
