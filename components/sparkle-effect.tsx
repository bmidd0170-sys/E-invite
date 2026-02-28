"use client"

import { useEffect, useRef } from "react"

export function SparkleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }

    resizeCanvas()

    const sparkles: Array<{
      x: number
      y: number
      size: number
      opacity: number
      speed: number
      phase: number
    }> = []

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    for (let i = 0; i < 120; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      sparkles.forEach((sparkle) => {
        sparkle.phase += sparkle.speed
        sparkle.opacity = (Math.sin(sparkle.phase) + 1) / 2

        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity * 0.8})`
        ctx.fill()

        // Add a tiny glow
        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity * 0.15})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
