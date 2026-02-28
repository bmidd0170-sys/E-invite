"use client"

import { Music, Play } from "lucide-react"

const videos = [
  {
    url: "https://youtu.be/3siLBRsoxq4",
    embedId: "3siLBRsoxq4",
    label: "Get in the Party Mood",
  },
  {
    url: "https://youtu.be/Uh58gKZH85M",
    embedId: "Uh58gKZH85M",
    label: "Feel the Vibes",
  },
]

export function VideoSection() {
  return (
    <section className="w-full max-w-[800px] mx-auto mt-12 md:mt-16">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: "#C41E3A" }} />
        <Music className="w-5 h-5" style={{ color: "#C41E3A" }} />
        <h2 className="font-serif text-2xl md:text-3xl text-foreground tracking-wide" style={{ fontStyle: "italic" }}>
          Get Ready to Celebrate
        </h2>
        <Music className="w-5 h-5" style={{ color: "#C41E3A" }} />
        <div className="h-px flex-1 max-w-[80px]" style={{ backgroundColor: "#C41E3A" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.embedId} className="flex flex-col gap-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
              <iframe
                src={`https://www.youtube.com/embed/${video.embedId}?rel=0`}
                title={video.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" style={{ color: "#C41E3A" }} />
              <p className="text-muted-foreground text-sm font-medium">{video.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
