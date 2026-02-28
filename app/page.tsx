import { InvitationCard } from "@/components/invitation-card"
import { EventDetails } from "@/components/event-details"
import { VideoSection } from "@/components/video-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top decorative line */}
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />

      <div className="px-4 md:px-6 py-10 md:py-16">
        {/* Invitation Card */}
        <InvitationCard />

        {/* Countdown */}
        <CountdownTimer />

        {/* Event Details */}
        <EventDetails />

        {/* Video Section */}
        <VideoSection />

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
