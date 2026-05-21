import { useEffect, useRef } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useSettingsStore } from '../store/settings'
import { themes } from '../themes'

interface BgDot {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  pulseSpeed: number
  pulseOffset: number
}

export function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotsRef = useRef<BgDot[]>([])
  
  // Connect settings store fields
  const themeName = useSettingsStore((state) => state.theme)
  const bgParticles = useSettingsStore((state) => state.bgParticles)
  
  useCanvas(canvasRef)

  // Initialize or reinitialize dots on size or theme change
  const reinitDots = (width: number, height: number, themeKey: typeof themeName) => {
    const themeObj = themes[themeKey]
    const accents = themeObj.accents
    const dots: BgDot[] = []
    
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // Slow drift
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.2,
        color: accents[Math.floor(Math.random() * accents.length)],
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }
    dotsRef.current = dots
  }

  // Handle reinitialization when theme changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      reinitDots(canvas.width, canvas.height, themeName)
    }
  }, [themeName])

  // Handle initialization on mount once dimensions are set
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && dotsRef.current.length === 0) {
      reinitDots(canvas.width, canvas.height, themeName)
    }
  }, [themeName])

  useEffect(() => {
    let animFrame: number
    let frameCount = 0

    const tick = () => {
      const canvas = canvasRef.current
      if (!canvas) {
        animFrame = requestAnimationFrame(tick)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        animFrame = requestAnimationFrame(tick)
        return
      }

      // If background particles are disabled, just clear the canvas and idle
      if (!bgParticles) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        animFrame = requestAnimationFrame(tick)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const dots = dotsRef.current
      const w = canvas.width
      const h = canvas.height

      // If dimensions changed and list is empty or coordinates out of bounds, reinit
      if (dots.length === 0) {
        reinitDots(w, h, themeName)
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        // Drift
        dot.x += dot.vx
        dot.y += dot.vy

        // Bounce boundaries
        if (dot.x < 0) {
          dot.x = 0
          dot.vx = -dot.vx
        } else if (dot.x > w) {
          dot.x = w
          dot.vx = -dot.vx
        }

        if (dot.y < 0) {
          dot.y = 0
          dot.vy = -dot.vy
        } else if (dot.y > h) {
          dot.y = h
          dot.vy = -dot.vy
        }

        // Draw dot with pulsing alpha
        const alpha = 0.08 + 0.12 * Math.sin(frameCount * dot.pulseSpeed + dot.pulseOffset)
        
        ctx.save()
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.globalAlpha = Math.max(0.01, Math.min(1.0, alpha))
        ctx.fill()
        ctx.restore()
      }

      frameCount++
      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [bgParticles, themeName])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  )
}
