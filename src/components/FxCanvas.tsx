import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useSettingsStore } from '../store/settings'
import { themes } from '../themes'
import type { Particle } from '../effects/types'
import { spawnEffect } from '../effects'

export interface FxCanvasHandle {
  spawn: (x: number, y: number, key?: string) => void
}

export const FxCanvas = forwardRef<FxCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Setup canvas size handlers
  useCanvas(canvasRef)

  // Expose spawn method to parent components
  useImperativeHandle(ref, () => ({
    spawn(x: number, y: number, key?: string) {
      // Get latest state synchronously to avoid subscriptions/re-renders
      const settings = useSettingsStore.getState()
      const themeObj = themes[settings.theme]
      
      let intensityFactor = 1.0
      let isSpace = false

      if (key === 'Backspace') {
        intensityFactor = 0.5
      } else if (key === 'Enter') {
        intensityFactor = 2.0
      } else if (key === ' ') {
        isSpace = true
      }

      const activeIntensity = settings.intensity * intensityFactor
      
      // Enforce absolute cap of 800 particles
      if (particlesRef.current.length >= 800) {
        return
      }

      // Spawn the particles
      const newParticles = spawnEffect(
        settings.effect,
        x,
        y,
        {
          intensity: activeIntensity,
          speed: settings.speed,
          theme: themeObj,
          isSpace
        }
      )

      // Append new particles, capping at 800
      const combined = [...particlesRef.current, ...newParticles]
      if (combined.length > 800) {
        particlesRef.current = combined.slice(combined.length - 800)
      } else {
        particlesRef.current = combined
      }
    }
  }))

  useEffect(() => {
    let animFrame: number

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

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      const particles = particlesRef.current
      const nextParticles: Particle[] = []

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.update()
        if (p.life > 0) {
          p.draw(ctx)
          nextParticles.push(p)
        }
      }

      particlesRef.current = nextParticles
      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  )
})

FxCanvas.displayName = 'FxCanvas'
