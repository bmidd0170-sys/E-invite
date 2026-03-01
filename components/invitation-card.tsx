"use client"

import Image from "next/image"
import { SparkleEffect } from "./sparkle-effect"

export function InvitationCard() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-[1463/2048] overflow-hidden rounded-lg shadow-2xl shadow-primary/20 bg-black">
      <Image
        src="/1596298992813115960.png"
        alt="Invitation card"
        fill
        className="object-contain"
        priority
      />
      <div className="absolute inset-0 pointer-events-none z-10">
        <SparkleEffect mode="edges" />
      </div>
    </div>
  )
}
