"use client"

import Image from "next/image"
import { SparkleEffect } from "./sparkle-effect"

export function InvitationCard() {
  return (
    <div className="relative mx-auto overflow-hidden rounded-lg shadow-2xl shadow-red-900/40 bg-black">
      <Image
        src="/1849042460367694260.png"
        alt="Invitation card"
        width={1463}
        height={2048}
        className="w-auto h-auto"
        priority
      />
      <div className="absolute inset-0 pointer-events-none z-10">
        <SparkleEffect mode="edges" />
      </div>
    </div>
  )
}
