"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { InvitationCard } from "@/components/invitation-card"
import { EventBanner, EventDetails } from "@/components/event-details"
import { VideoSection } from "@/components/video-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart } from "lucide-react"

export default function Home() {
  const [rsvpSent, setRsvpSent] = useState(false)

  useEffect(() => {
    const rsvpStatus = localStorage.getItem('rsvp_sent')
    if (rsvpStatus === 'true') {
      setRsvpSent(true)
    }
  }, [])
  return (
    <main className="min-h-screen bg-background">
      {/* Top decorative line */}
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />

      <div className="px-4 md:px-6 py-10 md:py-16">
        {/* Invitation Card */}
        <div className="relative w-full max-w-[800px] mx-auto">
          <InvitationCard />
        </div>

        {/* RSVP Call to Action */}
        {!rsvpSent && (
          <div className="w-full max-w-[800px] mx-auto mt-8 md:mt-10">
            <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8 text-center">
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Ready to Celebrate?</h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6">
                Please RSVP to confirm your attendance at Patricia's 60th Birthday Celebration
              </p>
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 font-serif font-semibold px-8 py-3 rounded-md text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#C41E3A]/30"
                style={{ background: "linear-gradient(to right, #C41E3A, #8B0000)" }}
              >
                RSVP Now
              </a>
            </div>
          </div>
        )}

        {/* Event Banner */}
        <EventBanner />

        {/* Countdown */}
        <CountdownTimer />

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
