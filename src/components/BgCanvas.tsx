import { useEffect, useRef } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useSettingsStore, type BgStyle } from '../store/settings'
import { themes, type ThemeName } from '../themes'

interface BgDot {
  x: number
  y: number
  vx: number
  vy: number
  ox: number // original starting x (for resetting drift limits or grids)
  oy: number // original starting y
  radius: number
  color: string
  pulseSpeed: number
  pulseOffset: number
}

interface GridNode {
  ox: number
  oy: number
  x: number
  y: number
}

interface MatrixStream {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number
}

interface Shockwave {
  x: number
  y: number
  radius: number
  strength: number
  maxRadius: number
  active: boolean
}

const getUiAccents = (uiStyleKey: string, themeKey: ThemeName) => {
  switch (uiStyleKey) {
    case 'cute':
      return ['#f472b6', '#f43f5e', '#ec4899']
    case 'hacker':
      return ['#10b981', '#34d399', '#059669']
    case 'cyber':
      return ['#06b6d4', '#22d3ee', '#0891b2']
    case 'retro':
      return ['#f59e0b', '#d97706', '#fbbf24']
    case 'glass':
      return ['#ffffff', '#e2e8f0', '#cbd5e1']
    case 'classic':
    default:
      return themes[themeKey]?.accents || ['#00ff9d']
  }
}

export function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // Backing data structures
  const dotsRef = useRef<BgDot[]>([])
  const gridNodesRef = useRef<GridNode[][]>([])
  const matrixStreamsRef = useRef<MatrixStream[]>([])
  
  // Interactive coordinate refs (to avoid React re-renders on mousemove/clicks)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const shockwaveRef = useRef<Shockwave>({ x: 0, y: 0, radius: 0, strength: 0, maxRadius: 0, active: false })

  // Subscribe to store settings
  const themeName = useSettingsStore((state) => state.theme)
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const bgParticles = useSettingsStore((state) => state.bgParticles)
  const bgStyle = useSettingsStore((state) => state.bgStyle)
  const bgInteraction = useSettingsStore((state) => state.bgInteraction)
  const bgCount = useSettingsStore((state) => state.bgCount)
  const bgSpeed = useSettingsStore((state) => state.bgSpeed)

  useCanvas(canvasRef)

  // Reinitialize backgrounds
  const reinitBackground = (width: number, height: number, style: BgStyle, count: number, themeKey: typeof themeName, uiStyleKey: typeof uiStyle) => {
    const accents = getUiAccents(uiStyleKey, themeKey)
    
    // Clear old state
    dotsRef.current = []
    gridNodesRef.current = []
    matrixStreamsRef.current = []

    if (style === 'bokeh' || style === 'starfield') {
      const dots: BgDot[] = []
      for (let i = 0; i < count; i++) {
        const radius = style === 'bokeh' ? Math.random() * 2.5 + 1.2 : Math.random() * 1.5 + 0.8
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          ox: 0,
          oy: 0,
          vx: (Math.random() - 0.5) * 0.3 * (style === 'starfield' ? 0.6 : 1),
          vy: (Math.random() - 0.5) * 0.3 * (style === 'starfield' ? 0.6 : 1),
          radius,
          color: accents[Math.floor(Math.random() * accents.length)],
          pulseSpeed: Math.random() * 0.015 + 0.005,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
      dotsRef.current = dots
    } 
    else if (style === 'grid') {
      const step = 65 // Grid cell width/height
      const cols = Math.ceil(width / step) + 1
      const rows = Math.ceil(height / step) + 1
      const grid: GridNode[][] = []

      for (let c = 0; c < cols; c++) {
        grid[c] = []
        for (let r = 0; r < rows; r++) {
          grid[c][r] = {
            ox: c * step,
            oy: r * step,
            x: c * step,
            y: r * step,
          }
        }
      }
      gridNodesRef.current = grid
    } 
    else if (style === 'matrix') {
      const colWidth = 24
      const cols = Math.ceil(width / colWidth)
      const streams: MatrixStream[] = []

      for (let i = 0; i < cols; i++) {
        // Japanese Katakana / general Matrix digits
        const len = 8 + Math.floor(Math.random() * 12)
        const chars: string[] = []
        for (let j = 0; j < len; j++) {
          chars.push(String.fromCharCode(0x30A0 + Math.random() * 96))
        }

        streams.push({
          x: i * colWidth,
          y: Math.random() * -height - 100, // staggered start offsets
          speed: 0.8 + Math.random() * 1.5,
          chars,
          opacity: 0.08 + Math.random() * 0.22,
        })
      }
      matrixStreamsRef.current = streams
    }
  }

  // Handle reinitialization triggers
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      reinitBackground(canvas.width, canvas.height, bgStyle, bgCount, themeName, uiStyle)
    }
  }, [themeName, bgStyle, bgCount, uiStyle])

  // Canvas interaction listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (!bgParticles) return
      // Trigger propagating shockwave
      shockwaveRef.current = {
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        strength: 65, // displacement force in pixels
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.3,
        active: true,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [bgParticles])

  // 60fps Loop
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

      const w = canvas.width
      const h = canvas.height
      const accents = getUiAccents(uiStyle, themeName)

      // Shockwave calculation
      const wave = shockwaveRef.current
      if (wave.active) {
        wave.radius += 14 // Speed of propagation
        wave.strength *= 0.945 // Fade rate of displacement force
        if (wave.radius > wave.maxRadius || wave.strength < 0.1) {
          wave.active = false
        }
      }

      const mouse = mouseRef.current
      const interactionRadius = 220
      const driftMult = bgSpeed / 3

      // Apply effects depending on style
      if (bgStyle === 'bokeh' || bgStyle === 'starfield') {
        const dots = dotsRef.current
        if (dots.length === 0) {
          reinitBackground(w, h, bgStyle, bgCount, themeName, uiStyle)
          animFrame = requestAnimationFrame(tick)
          return
        }

        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i]

          // 1. Core Drift physics
          dot.x += dot.vx * driftMult
          dot.y += dot.vy * driftMult

          // 2. Mouse interactive field
          if (bgInteraction !== 'none' && mouse.x > 0) {
            const dx = dot.x - mouse.x
            const dy = dot.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < interactionRadius) {
              const force = (interactionRadius - dist) / interactionRadius
              const angle = Math.atan2(dy, dx)
              const pushAmt = force * 2.5 // magnitude of drag/push

              if (bgInteraction === 'repel') {
                dot.x += Math.cos(angle) * pushAmt
                dot.y += Math.sin(angle) * pushAmt
              } else if (bgInteraction === 'gravity') {
                dot.x -= Math.cos(angle) * pushAmt
                dot.y -= Math.sin(angle) * pushAmt
              }
            }
          }

          // 3. Click Shockwave force field
          if (wave.active) {
            const dx = dot.x - wave.x
            const dy = dot.y - wave.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const waveWidth = 70 // thickness of ripple wave

            const distDiff = Math.abs(dist - wave.radius)
            if (distDiff < waveWidth && dist > 10) {
              const waveForce = (1.0 - distDiff / waveWidth) * wave.strength * 0.15
              const angle = Math.atan2(dy, dx)
              dot.x += Math.cos(angle) * waveForce
              dot.y += Math.sin(angle) * waveForce
            }
          }

          // 4. Wrap around boundaries
          if (dot.x < -20) dot.x = w + 20
          else if (dot.x > w + 20) dot.x = -20
          
          if (dot.y < -20) dot.y = h + 20
          else if (dot.y > h + 20) dot.y = -20

          // 5. Draw
          const alphaBase = bgStyle === 'bokeh' ? 0.08 : 0.25
          const alphaOsc = bgStyle === 'bokeh' ? 0.12 : 0.2
          const alpha = alphaBase + alphaOsc * Math.sin(frameCount * dot.pulseSpeed + dot.pulseOffset)
          
          ctx.save()
          ctx.globalAlpha = Math.max(0.01, Math.min(1.0, alpha))
          
          if (bgStyle === 'bokeh') {
            // Draw soft dots
            ctx.beginPath()
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
            ctx.fillStyle = dot.color
            ctx.fill()
          } else {
            // Draw twinkling stars (crosses)
            ctx.strokeStyle = dot.color
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(dot.x - dot.radius * 2, dot.y)
            ctx.lineTo(dot.x + dot.radius * 2, dot.y)
            ctx.moveTo(dot.x, dot.y - dot.radius * 2)
            ctx.lineTo(dot.x, dot.y + dot.radius * 2)
            ctx.stroke()
          }
          ctx.restore()
        }
      } 
      else if (bgStyle === 'grid') {
        const grid = gridNodesRef.current
        if (grid.length === 0) {
          reinitBackground(w, h, bgStyle, bgCount, themeName, uiStyle)
          animFrame = requestAnimationFrame(tick)
          return
        }

        const cols = grid.length
        const rows = grid[0].length

        // Render line nodes by applying forces to display coordinates
        const renderGrid: { x: number; y: number }[][] = []

        for (let c = 0; c < cols; c++) {
          renderGrid[c] = []
          for (let r = 0; r < rows; r++) {
            const node = grid[c][r]
            
            // Base coords
            let tx = node.ox
            let ty = node.oy

            // 1. Mouse Drag
            if (bgInteraction !== 'none' && mouse.x > 0) {
              const dx = tx - mouse.x
              const dy = ty - mouse.y
              const dist = Math.sqrt(dx * dx + dy * dy)

              if (dist < interactionRadius) {
                const force = (interactionRadius - dist) / interactionRadius
                const angle = Math.atan2(dy, dx)
                // Pull or push base locations
                const distortAmt = force * 35
                
                if (bgInteraction === 'repel') {
                  tx += Math.cos(angle) * distortAmt
                  ty += Math.sin(angle) * distortAmt
                } else if (bgInteraction === 'gravity') {
                  tx -= Math.cos(angle) * distortAmt
                  ty -= Math.sin(angle) * distortAmt
                }
              }
            }

            // 2. Click Shockwave
            if (wave.active) {
              const dx = tx - wave.x
              const dy = ty - wave.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              const waveWidth = 80

              const distDiff = Math.abs(dist - wave.radius)
              if (distDiff < waveWidth && dist > 10) {
                const waveForce = (1.0 - distDiff / waveWidth) * wave.strength * 0.8
                const angle = Math.atan2(dy, dx)
                tx += Math.cos(angle) * waveForce
                ty += Math.sin(angle) * waveForce
              }
            }

            // Linear smoothing for transition coords
            node.x += (tx - node.x) * 0.12
            node.y += (ty - node.y) * 0.12

            renderGrid[c][r] = { x: node.x, y: node.y }
          }
        }

        // Draw distorted lines
        ctx.save()
        ctx.strokeStyle = accents[0] || 'var(--accent)'
        ctx.globalAlpha = 0.07 // soft subtle layout grid
        ctx.lineWidth = 0.75

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const current = renderGrid[c][r]
            
            // Draw horizontal connector
            if (c < cols - 1) {
              const right = renderGrid[c + 1][r]
              ctx.beginPath()
              ctx.moveTo(current.x, current.y)
              ctx.lineTo(right.x, right.y)
              ctx.stroke()
            }
            
            // Draw vertical connector
            if (r < rows - 1) {
              const bottom = renderGrid[c][r + 1]
              ctx.beginPath()
              ctx.moveTo(current.x, current.y)
              ctx.lineTo(bottom.x, bottom.y)
              ctx.stroke()
            }
          }
        }
        ctx.restore()
      } 
      else if (bgStyle === 'matrix') {
        const streams = matrixStreamsRef.current
        if (streams.length === 0) {
          reinitBackground(w, h, bgStyle, bgCount, themeName, uiStyle)
          animFrame = requestAnimationFrame(tick)
          return
        }

        ctx.save()
        ctx.font = '13px monospace'

        for (let i = 0; i < streams.length; i++) {
          const stream = streams[i]

          // 1. Scroll vertical coordinates downwards
          stream.y += stream.speed * driftMult * 1.5

          // 2. Mouse Repel (drifts streams slightly to left/right)
          let renderX = stream.x
          if (bgInteraction !== 'none' && mouse.x > 0) {
            const dx = stream.x - mouse.x
            const dy = stream.y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < interactionRadius) {
              const force = (interactionRadius - dist) / interactionRadius
              const pushAmt = force * 22
              renderX += dx > 0 ? pushAmt : -pushAmt
            }
          }

          // 3. Click shockwave horizontal displacement
          if (wave.active) {
            const dx = stream.x - wave.x
            const dy = stream.y - wave.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const waveWidth = 80
            
            const distDiff = Math.abs(dist - wave.radius)
            if (distDiff < waveWidth && dist > 10) {
              const waveForce = (1.0 - distDiff / waveWidth) * wave.strength * 0.4
              renderX += dx > 0 ? waveForce : -waveForce
            }
          }

          // Wrap stream when falling off bottom
          if (stream.y - stream.chars.length * 18 > h) {
            stream.y = -50
            stream.speed = 0.8 + Math.random() * 1.5
          }

          // Randomize character mutations
          if (Math.random() < 0.03) {
            const randIdx = Math.floor(Math.random() * stream.chars.length)
            stream.chars[randIdx] = String.fromCharCode(0x30A0 + Math.random() * 96)
          }

          // Draw the characters column
          for (let j = 0; j < stream.chars.length; j++) {
            const charY = stream.y - j * 18
            if (charY < -20 || charY > h + 20) continue

            // Fade character alpha down the trail
            const charAlpha = (1 - j / stream.chars.length) * stream.opacity
            
            // Render lead character bright matrix green/white
            ctx.fillStyle = j === 0 ? '#ffffff' : (accents[0] || '#00ff9d')
            ctx.globalAlpha = j === 0 ? stream.opacity * 1.5 : charAlpha
            
            ctx.fillText(stream.chars[j], renderX, charY)
          }
        }
        ctx.restore()
      }

      frameCount++
      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [bgParticles, themeName, uiStyle, bgStyle, bgInteraction, bgCount, bgSpeed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  )
}
