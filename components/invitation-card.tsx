"use client"

import Image from "next/image"
import { SparkleEffect } from "./sparkle-effect"

export function InvitationCard() {
  return (
    <div className="relative w-full max-w-[700px] mx-auto overflow-hidden rounded-lg shadow-2xl shadow-primary/20">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1596298992813115960-EiZZcXEpb1HsDnzmT9MOsVWC6l7adu.png"
        alt="Patricia's 60th Birthday Party Invitation - June 14, 2026 at Kimpton Resort & Spa, Roatan, Honduras, June 12-15, 2026. RSVP: Katherine 123-456-7890 / www.birthday.com"
        width={1080}
        height={1512}
        className="w-full h-auto"
        priority
      />
      {/* Sparkle/glitter overlay on top of the card image */}
      <div className="absolute inset-0 pointer-events-none">
        <SparkleEffect />
      </div>
    </div>
  )
}
