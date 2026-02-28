"use client"

import { MapPin, CalendarDays, Sun, Palmtree, Music } from "lucide-react"

export function EventDetails() {
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Card */}
        <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8 flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(196, 30, 58, 0.15)" }}
          >
            <MapPin className="w-6 h-6" style={{ color: "#C41E3A" }} />
          </div>
          <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
            Venue
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            Kimpton Resort & Spa
          </p>
          <p className="text-muted-foreground text-sm md:text-base">
            Roatan, Honduras
          </p>
        </div>

        {/* Dates Card */}
        <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8 flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(196, 30, 58, 0.15)" }}
          >
            <CalendarDays className="w-6 h-6" style={{ color: "#C41E3A" }} />
          </div>
          <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
            Dates
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {"Birthday: June 14, 2026"}
          </p>
          <p className="text-muted-foreground text-sm md:text-base">
            {"Trip: June 12 - 15, 2026"}
          </p>
        </div>
      </div>
    </section>
  )
}
