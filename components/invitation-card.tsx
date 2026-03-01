"use client"

import Image from "next/image"
import { SparkleEffect } from "./sparkle-effect"

export function InvitationCard() {
  return (
    <div className="relative w-full max-w-[700px] mx-auto overflow-hidden rounded-lg shadow-2xl shadow-primary/20" style={{ aspectRatio: "5/7" }}>
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Sparkle/glitter border effect around edges */}
      <div className="absolute inset-0 pointer-events-none">
        <SparkleEffect />
      </div>

      {/* Red ribbon from top-left corner */}
      <div className="absolute top-0 left-0 z-20 w-[45%] h-[22%]">
        {/* Diagonal ribbon - top-left to bow */}
        <div
          className="absolute top-0 left-0 w-[140%] h-[6px] origin-top-left"
          style={{
            background: "linear-gradient(90deg, #8B0000, #C41E3A, #8B0000)",
            transform: "rotate(35deg)",
            boxShadow: "0 2px 8px rgba(196, 30, 58, 0.4)",
          }}
        />
      </div>

      {/* Red bow with diamond */}
      <div className="absolute left-[6%] top-[8%] w-[22%] z-20" style={{ aspectRatio: "1" }}>
        <Image
          src="/images/red-ribbon-bow.jpg"
          alt="Decorative red bow with diamond center"
          fill
          className="object-contain"
        />
      </div>

      {/* "PATRICIA TURNS" text - top right */}
      <div className="absolute top-[6%] right-[6%] z-10 text-right">
        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.2em] uppercase leading-tight"
          style={{ color: "#C41E3A" }}
        >
          Patricia
        </p>
        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.2em] uppercase leading-tight"
          style={{ color: "#C41E3A" }}
        >
          Turns
        </p>
      </div>

      {/* Large "60" with photo in the "0" */}
      <div className="absolute top-[18%] left-[5%] right-[5%] z-10 flex items-center justify-center" style={{ height: "40%" }}>
        {/* The "6" */}
        <span
          className="font-serif leading-none select-none"
          style={{
            fontSize: "clamp(8rem, 28vw, 18rem)",
            color: "#a0a0a0",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          6
        </span>

        {/* The "0" as an oval photo frame */}
        <div className="relative" style={{ width: "clamp(5rem, 18vw, 12rem)", height: "clamp(7rem, 25vw, 16rem)" }}>
          {/* Silver border oval */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              border: "5px solid #a0a0a0",
              boxShadow: "0 0 20px rgba(160, 160, 160, 0.3), inset 0 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <Image
              src="/images/patricia-red-dress.jpg"
              alt="Patricia in a red dress"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* "Birthday" in red script */}
      <div className="absolute z-10 w-full text-center" style={{ top: "55%" }}>
        <p
          className="font-serif leading-none"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 6rem)",
            color: "#C41E3A",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          Birthday
        </p>
      </div>

      {/* "PARTY" */}
      <div className="absolute z-10 w-full text-center" style={{ top: "64%" }}>
        <p
          className="tracking-[0.35em] uppercase font-semibold text-lg sm:text-xl md:text-2xl"
          style={{ color: "#f5f5f5" }}
        >
          Party
        </p>
      </div>

      {/* Red divider line */}
      <div className="absolute z-10 left-1/2 -translate-x-1/2" style={{ top: "69%", width: "30%", height: "2px", background: "#C41E3A" }} />

      {/* Date */}
      <div className="absolute z-10 w-full text-center" style={{ top: "71%" }}>
        <p
          className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider"
          style={{ color: "#f5f5f5" }}
        >
          June 14, 2026
        </p>
      </div>

      {/* Venue details */}
      <div className="absolute z-10 w-full text-center" style={{ top: "78%" }}>
        <p
          className="text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase"
          style={{ color: "#d4d4d4" }}
        >
          Kimpton Resort & Spa
        </p>
        <p
          className="text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase mt-1"
          style={{ color: "#d4d4d4" }}
        >
          Roatan, Honduras
        </p>
        <p
          className="font-serif text-xs sm:text-sm md:text-base mt-2"
          style={{ color: "#d4d4d4", fontStyle: "italic" }}
        >
          June 12-15, 2026
        </p>
      </div>

      {/* RSVP line */}
      <div className="absolute z-10 w-full text-center" style={{ top: "90%" }}>
        <p
          className="text-[10px] sm:text-xs md:text-sm tracking-wider"
          style={{ color: "#a0a0a0" }}
        >
          {'RSVP: Katherine 123-456-7890 / www.birthday.com'}
        </p>
      </div>
    </div>
  )
}
