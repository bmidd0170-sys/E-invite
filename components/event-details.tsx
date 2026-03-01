"use client"

import { Sun, Palmtree } from "lucide-react"

export function EventBanner() {
  return (
    <section className="w-full max-w-[800px] mx-auto mt-12 md:mt-16">
      {/* Fun in the Sun Banner */}
      <div className="relative overflow-hidden rounded-lg mb-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/roatan-beach.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]/90" />
        <div className="relative z-10 flex flex-col items-center py-10 md:py-14 px-6">
          <div className="flex items-center gap-3 mb-3">
            <Sun className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#C41E3A" }} />
            <Palmtree className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#C41E3A" }} />
          </div>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground tracking-wide"
            style={{ fontStyle: "italic" }}
          >
            Fun in the Sun
          </h2>
          <p className="text-muted-foreground mt-3 text-center max-w-md text-sm md:text-base">
            {"Join us for an unforgettable tropical celebration in beautiful Roatan, Honduras"}
          </p>
        </div>
      </div>
    </section>
  )
}

export function EventDetails() {
  const itineraryItems = [
    {
      time: "Day 1 - June 12",
      title: "Arrival & Check-in",
      description: "Welcome to Roatan! Check-in at Kimpton Resort & Spa and settle in."
    },
    {
      time: "Day 2 - June 13",
      title: "Beach Activities",
      description: "Enjoy water sports, snorkeling, and relaxation on the beautiful beach."
    },
    {
      time: "Day 3 - June 14",
      title: "Birthday Celebration",
      description: "Special dinner party and celebration honoring Patricia's 60th birthday."
    },
    {
      time: "Day 4 - June 15",
      title: "Departure",
      description: "Final morning breakfast and checkout. Safe travels home!"
    }
  ]

  return (
    <section className="w-full max-w-[800px] mx-auto mt-12 md:mt-16">
      {/* Separator line */}
      <div className="h-px w-full mb-8" style={{ background: "linear-gradient(to right, transparent, #C41E3A, transparent)" }} />
      
      {/* Itinerary Container */}
      <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
          Itinerary
        </h2>
        
        <div className="space-y-6">
          {itineraryItems.map((item, index) => (
            <div key={index}>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 font-serif font-semibold"
                  style={{ backgroundColor: "rgba(196, 30, 58, 0.15)", color: "#C41E3A" }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold" style={{ color: "#C41E3A" }}>
                    {item.time}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
              {index < itineraryItems.length - 1 && (
                <div className="h-px w-full mt-6" style={{ background: "linear-gradient(to right, transparent, rgba(196, 30, 58, 0.3), transparent)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
