"use client"

import { Music, Play } from "lucide-react"

const videos = [
  {
    url: "https://youtu.be/Uh58gKZH85M",
    embedId: "Uh58gKZH85M",
    label: "Feel the Vibes",
  },
  {
    url: "https://youtu.be/3siLBRsoxq4",
    embedId: "3siLBRsoxq4",
    label: "Get in the Party Mood",
  },
  {
    url: "https://youtu.be/C1QujVeofUo",
    embedId: "C1QujVeofUo",
    label: "Ready to Party",
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

      <div className="flex flex-col gap-6">
        {/* Top two videos side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.slice(0, 2).map((video) => (
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
            </div>
          ))}
        </div>

        {/* Bottom centered video */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
              <iframe
                src={`https://www.youtube.com/embed/${videos[2].embedId}?rel=0`}
                title={videos[2].label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
