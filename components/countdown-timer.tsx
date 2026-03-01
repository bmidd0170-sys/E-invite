"use client"

import { useEffect, useState } from "react"

function getTimeLeft() {
  const target = new Date("2026-06-14T00:00:00").getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Set initial time on client only to avoid hydration mismatch
    setTime(getTimeLeft())
    
    const interval = setInterval(() => {
      setTime(getTimeLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ]

  return (
    <section className="w-full max-w-[800px] mx-auto mt-12 md:mt-16">
      <p className="text-center text-muted-foreground text-sm uppercase tracking-[0.2em] mb-6">
        Countdown to the Celebration
      </p>
      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-4 md:py-6 rounded-lg border border-border bg-secondary/50"
          >
            <span
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{ color: "#C41E3A" }}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-xs md:text-sm mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
