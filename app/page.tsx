"use client"

import Image from "next/image"
import { InvitationCard } from "@/components/invitation-card"
import { EventBanner, EventDetails } from "@/components/event-details"
import { VideoSection } from "@/components/video-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top decorative line */}
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />

      <div className="px-4 md:px-6 py-10 md:py-16">
        {/* Invitation Card with outside image */}
        <div className="relative w-full max-w-[800px] mx-auto">
          <InvitationCard />
          
          {/* Image on right side outside card */}
          <div className="hidden md:block absolute -right-56 top-1/2 transform -translate-y-1/2 w-48 h-64 border-4 border-[#C41E3A]" style={{ boxShadow: "0 0 40px 10px rgba(196, 30, 58, 0.2)" }}>
            <Image
              src="/4234121429247846438.png"
              alt="Decorative image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Countdown */}
        <CountdownTimer />

        {/* Event Banner */}
        <EventBanner />

        {/* Video Section */}
        <VideoSection />

        {/* Event Details */}
        <EventDetails />

        {/* Footer */}
        <footer className="w-full max-w-[800px] mx-auto mt-16 md:mt-20 pb-8">
          <div className="h-px w-full mb-8" style={{ background: "linear-gradient(to right, transparent, #C41E3A, transparent)" }} />
          <div className="flex flex-col items-center gap-3 text-center">
            <Heart className="w-5 h-5" style={{ color: "#C41E3A" }} fill="#C41E3A" />
            <p className="font-serif text-lg md:text-xl text-foreground" style={{ fontStyle: "italic" }}>
              {"Let's celebrate Patricia in style!"}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">
              {"If you have any questions, please don't hesitate to reach out."}
            </p>
          </div>
        </footer>
      </div>

      {/* Bottom decorative line */}
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />
    </main>
  )
}
