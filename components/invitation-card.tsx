"use client"

import Image from "next/image"
import { SparkleEffect } from "./sparkle-effect"

export function InvitationCard() {
  return (
    <div className="relative w-full max-w-[800px] mx-auto aspect-[4/3] overflow-hidden rounded-lg shadow-2xl shadow-primary/20">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0d0d0d]" />

      {/* Glitter strip on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-[15%] overflow-hidden">
        <Image
          src="/images/glitter.jpg"
          alt=""
          fill
          className="object-cover opacity-70"
        />
        <SparkleEffect />
      </div>

      {/* Red ribbon vertical */}
      <div className="absolute right-[14%] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#C41E3A] via-[#8B0000] to-[#C41E3A]" />

      {/* Red ribbon horizontal */}
      <div className="absolute right-0 top-[38%] h-[3px] w-[20%] bg-gradient-to-r from-[#C41E3A] via-[#8B0000] to-[#C41E3A]" />

      {/* Bow image */}
      <div className="absolute right-[5%] top-[28%] w-[18%] aspect-square z-10">
        <Image
          src="/images/red-bow.jpg"
          alt="Decorative red bow with diamond"
          fill
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 md:px-16 text-center pr-[20%]">
        {/* Save The Dates */}
        <h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide"
          style={{ fontStyle: "italic" }}
        >
          Save The Dates
        </h1>

        {/* Patricia */}
        <p
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 md:mt-4 tracking-wide"
          style={{ color: "#C41E3A", fontStyle: "italic" }}
        >
          Patricia
        </p>

        {/* IS TURNING */}
        <p
          className="text-sm sm:text-base md:text-lg mt-3 md:mt-5 tracking-[0.3em] uppercase font-semibold"
          style={{ color: "#C41E3A" }}
        >
          is turning
        </p>

        {/* 60 */}
        <p
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mt-1 md:mt-2"
          style={{ color: "#8B0000" }}
        >
          60
        </p>

        {/* Date */}
        <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground mt-2 md:mt-4 font-semibold">
          June 14, 2026
        </p>

        {/* Venue */}
        <p
          className="font-serif text-sm sm:text-base md:text-lg mt-2 md:mt-3 tracking-wide font-bold"
          style={{ color: "#ef4444" }}
        >
          {'"Kimpton Resort & Spa" Roatan, Honduras'}
        </p>

        {/* Trip Dates */}
        <p
          className="font-serif text-sm sm:text-base md:text-lg mt-1 tracking-wide font-bold"
          style={{ color: "#ef4444" }}
        >
          June 12-15, 2026
        </p>
      </div>
    </div>
  )
}
