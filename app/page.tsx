"use client"

import Image from "next/image"
import { useState } from "react"
import { InvitationCard } from "@/components/invitation-card"
import { EventBanner, EventDetails } from "@/components/event-details"
import { VideoSection } from "@/components/video-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { RSVPForm } from "@/components/rsvp-form"
import { useRsvpState } from "@/hooks/use-rsvp-state"
import { Heart, X } from "lucide-react"

export default function Home() {
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const rsvpSent = useRsvpState()
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
              <button
                onClick={() => setShowRsvpModal(true)}
                className="inline-flex items-center gap-2 bg-secondary/50 border border-border hover:border-[#C41E3A] font-serif font-semibold px-8 py-3 rounded-md text-[#C41E3A] transition-all duration-300 hover:shadow-lg hover:shadow-[#C41E3A]/30"
              >
                RSVP Now
              </button>
            </div>
          </div>
        )}

        {/* RSVP Modal */}
        {showRsvpModal && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-[#111111] rounded-lg shadow-2xl shadow-[#C41E3A]/30 p-6 md:p-8 border border-[#2a2a2a] w-full max-w-md relative">
              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <RSVPForm
                onSuccess={() => {
                  setShowRsvpModal(false)
                }}
              />
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
              <span style={{ color: "white" }}>Let's </span>
              <span style={{ color: "#C41E3A" }}>Celebrate Patricia</span>
              <span style={{ color: "white" }}> in style!</span>
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
