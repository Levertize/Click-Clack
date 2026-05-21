import { useEffect, useRef } from 'react'
import { useSettingsStore, type CursorTrail } from '../store/settings'
import { themes } from '../themes'

interface CustomCursorProps {
  focused: boolean
}

interface TrailParticle {
  type: CursorTrail | 'click-ripple' | 'click-spark'
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  char?: string
  life: number      // 1.0 -> 0.0
  decay: number
}

const MATRIX_CHARS = '01'.split('')

export function CustomCursor({ focused }: CustomCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<TrailParticle[]>([])
  
  // Track cursor position in refs
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const prevMouseRef = useRef({ x: 0, y: 0 })

  // DOM element refs for bypass updates
  const ringElRef = useRef<HTMLDivElement | null>(null)
  const dotElRef = useRef<HTMLDivElement | null>(null)
  const crosshairElRef = useRef<HTMLDivElement | null>(null)

  // Connect settings
  const cursorStyle = useSettingsStore((state) => state.cursorStyle)
  const cursorColorMode = useSettingsStore((state) => state.cursorColorMode)
  const cursorCustomColor = useSettingsStore((state) => state.cursorCustomColor)
  const cursorTrail = useSettingsStore((state) => state.cursorTrail)
  const cursorSize = useSettingsStore((state) => state.cursorSize)
  const cursorClickEffect = useSettingsStore((state) => state.cursorClickEffect)
  const themeName = useSettingsStore((state) => state.theme)

  const sizeMultiplier = cursorSize / 3 // 3 is standard size (x1.0)
  const dotSize = 8 * sizeMultiplier
  const ringSize = (focused ? 20 : 36) * sizeMultiplier

  // Set colors dynamically
  const getActiveColor = (timeMs: number): string => {
    if (cursorColorMode === 'custom') {
      return cursorCustomColor
    }
    if (cursorColorMode === 'rainbow') {
      const hue = (timeMs / 15) % 360
      return `hsl(${hue}, 85%, 65%)`
    }
    if (cursorColorMode === 'invert') {
      return '#ffffff'
    }
    // Accent mode
    const activeTheme = themes[themeName]
    return activeTheme ? activeTheme.accents[0] : '#00ff9d'
  }

  // Set style bindings
  const isRainbow = cursorColorMode === 'rainbow'
  const isInvert = cursorColorMode === 'invert'
  const isCustom = cursorColorMode === 'custom'

  const dotColorStyle = isInvert
    ? { backgroundColor: 'white', mixBlendMode: 'difference' as const }
    : isRainbow
    ? { animation: 'cursor-dot-rainbow 6s linear infinite' }
    : isCustom
    ? { backgroundColor: cursorCustomColor }
    : { backgroundColor: 'var(--accent)' }

  const ringColorStyle = isInvert
    ? { borderColor: 'white', mixBlendMode: 'difference' as const }
    : isRainbow
    ? { animation: 'cursor-ring-rainbow 6s linear infinite' }
    : isCustom
    ? { borderColor: cursorCustomColor }
    : { borderColor: 'var(--accent)' }

  const crosshairColorStyle = isInvert
    ? { backgroundColor: 'white', mixBlendMode: 'difference' as const }
    : isRainbow
    ? { animation: 'cursor-dot-rainbow 6s linear infinite' }
    : isCustom
    ? { backgroundColor: cursorCustomColor }
    : { backgroundColor: 'var(--accent)' }

  // Mouse trail and click effect setup
  useEffect(() => {
    if (cursorStyle === 'none') return

    // Position mouse initially to current viewport center
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    ringRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Handle mouse click splashes
    const handleMouseDown = (e: MouseEvent) => {
      if (!cursorClickEffect) return
      const color = getActiveColor(Date.now())
      
      // Spawn ripple ring
      particlesRef.current.push({
        type: 'click-ripple',
        x: e.clientX,
        y: e.clientY,
        vx: 0,
        vy: 0,
        size: 5,
        alpha: 1.0,
        color,
        life: 1.0,
        decay: 0.035, // about 30 frames
      })

      // Spawn sparks
      const sparkCount = 12
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1.5 + Math.random() * 3
        particlesRef.current.push({
          type: 'click-spark',
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 2 + Math.random() * 3,
          alpha: 1.0,
          color,
          life: 1.0,
          decay: 0.03 + Math.random() * 0.02,
        })
      }
    }

    // Handle mouse move to update ref coordinates and spawn trails
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      if (cursorTrail === 'none') return
      
      const dx = e.clientX - prevMouseRef.current.x
      const dy = e.clientY - prevMouseRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 4) {
        const color = getActiveColor(Date.now())
        
        if (cursorTrail === 'glow-dots') {
          particlesRef.current.push({
            type: 'glow-dots',
            x: e.clientX,
            y: e.clientY,
            vx: 0,
            vy: 0,
            size: 6 * sizeMultiplier,
            alpha: 0.6,
            color,
            life: 1.0,
            decay: 0.04,
          })
        } else if (cursorTrail === 'sparkles') {
          particlesRef.current.push({
            type: 'sparkles',
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 + 0.2, // slightly drift down
            size: 4 * sizeMultiplier,
            alpha: 1.0,
            color: cursorColorMode === 'custom' ? cursorCustomColor : '#ffd700', // gold or custom
            life: 1.0,
            decay: 0.05,
          })
        } else if (cursorTrail === 'matrix') {
          particlesRef.current.push({
            type: 'matrix',
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY,
            vx: 0,
            vy: 1.0 + Math.random() * 1.0, // fall down
            size: 10 * sizeMultiplier,
            alpha: 1.0,
            color: '#00ff9d',
            char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
            life: 1.0,
            decay: 0.03,
          })
        } else if (cursorTrail === 'bubbles') {
          particlesRef.current.push({
            type: 'bubbles',
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 0.8, // rise up
            size: 5 * sizeMultiplier,
            alpha: 0.5,
            color,
            life: 1.0,
            decay: 0.035,
          })
        }

        prevMouseRef.current = { x: e.clientX, y: e.clientY }
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)

    let animFrame: number
    const tick = () => {
      const mouse = mouseRef.current
      const ring = ringRef.current

      // Retrieve easing rate dynamically from state
      const easing = useSettingsStore.getState().cursorEasing

      // Smooth interpolation for the ring position
      ring.x += (mouse.x - ring.x) * easing
      ring.y += (mouse.y - ring.y) * easing

      // Update positions of cursor elements directly via DOM styling
      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`
      }
      if (ringElRef.current) {
        ringElRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      if (crosshairElRef.current) {
        crosshairElRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
      }

      // Draw trails on canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const activeParticles = particlesRef.current
        const nextParticles: TrailParticle[] = []

        for (let i = 0; i < activeParticles.length; i++) {
          const p = activeParticles[i]
          
          // Physics update
          p.x += p.vx
          p.y += p.vy
          p.life -= p.decay

          if (p.life > 0) {
            ctx.save()
            
            if (p.type === 'click-ripple') {
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size + (1.0 - p.life) * 45, 0, Math.PI * 2)
              ctx.strokeStyle = p.color
              ctx.lineWidth = 2 * p.life
              ctx.globalAlpha = p.life
              ctx.stroke()
            } else if (p.type === 'click-spark') {
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
              ctx.fillStyle = p.color
              ctx.globalAlpha = p.life
              ctx.fill()
            } else if (p.type === 'glow-dots') {
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
              ctx.fillStyle = p.color
              ctx.globalAlpha = p.alpha * p.life
              ctx.fill()
            } else if (p.type === 'sparkles') {
              const cx = p.x
              const cy = p.y
              const spikes = 4
              const outerRadius = p.size * p.life * 1.5
              const innerRadius = p.size * p.life * 0.4
              
              let rot = (Math.PI / 2) * 3
              let x = cx
              let y = cy
              const step = Math.PI / spikes

              ctx.beginPath()
              ctx.moveTo(cx, cy - outerRadius)
              for (let idx = 0; idx < spikes; idx++) {
                x = cx + Math.cos(rot) * outerRadius
                y = cy + Math.sin(rot) * outerRadius
                ctx.lineTo(x, y)
                rot += step

                x = cx + Math.cos(rot) * innerRadius
                y = cy + Math.sin(rot) * innerRadius
                ctx.lineTo(x, y)
                rot += step
              }
              ctx.lineTo(cx, cy - outerRadius)
              ctx.closePath()
              ctx.fillStyle = p.color
              ctx.globalAlpha = p.life
              ctx.fill()
            } else if (p.type === 'matrix') {
              ctx.font = `bold ${p.size}px monospace`
              ctx.fillStyle = p.color
              ctx.globalAlpha = p.life
              ctx.fillText(p.char || '1', p.x, p.y)
            } else if (p.type === 'bubbles') {
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size * (1.5 - p.life * 0.5), 0, Math.PI * 2)
              ctx.strokeStyle = p.color
              ctx.lineWidth = 1
              ctx.globalAlpha = p.alpha * p.life
              ctx.stroke()
            }

            ctx.restore()
            nextParticles.push(p)
          }
        }

        particlesRef.current = nextParticles
      }

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrame)
    }
  }, [cursorStyle, cursorTrail, cursorClickEffect, cursorColorMode, cursorCustomColor, themeName, sizeMultiplier])

  if (cursorStyle === 'none') {
    return (
      <style>{`
        * {
          cursor: auto !important;
        }
      `}</style>
    )
  }

  return (
    <>
      {/* Hide standard cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        @keyframes cursor-dot-rainbow {
          0% { background-color: hsl(0, 85%, 65%); }
          33% { background-color: hsl(120, 85%, 65%); }
          66% { background-color: hsl(240, 85%, 65%); }
          100% { background-color: hsl(360, 85%, 65%); }
        }
        @keyframes cursor-ring-rainbow {
          0% { border-color: hsl(0, 85%, 65%); }
          33% { border-color: hsl(120, 85%, 65%); }
          66% { border-color: hsl(240, 85%, 65%); }
          100% { border-color: hsl(360, 85%, 65%); }
        }
        @media (hover: none) {
          .custom-cursor {
            display: none !important;
          }
        }
      `}</style>

      {/* Render trail effects canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Render selected style */}
      {(cursorStyle === 'dot-ring' || cursorStyle === 'ring-only') && (
        <div
          ref={ringElRef}
          className="custom-cursor fixed pointer-events-none z-50 rounded-full border-[1.5px] transition-[width,height] duration-200 ease-out"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            left: 0,
            top: 0,
            transform: `translate3d(${ringRef.current.x}px, ${ringRef.current.y}px, 0) translate(-50%, -50%)`,
            ...ringColorStyle,
          }}
        />
      )}

      {(cursorStyle === 'dot-ring' || cursorStyle === 'dot-only') && (
        <div
          ref={dotElRef}
          className="custom-cursor fixed pointer-events-none z-50 rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            left: 0,
            top: 0,
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) translate(-50%, -50%)`,
            ...dotColorStyle,
          }}
        />
      )}

      {cursorStyle === 'crosshair' && (
        <div
          ref={crosshairElRef}
          className="custom-cursor fixed pointer-events-none z-50"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`,
          }}
        >
          {/* Top Tick */}
          <div
            className="absolute -translate-x-[0.5px]"
            style={{
              bottom: `${4 * sizeMultiplier}px`,
              left: 0,
              width: '1px',
              height: `${8 * sizeMultiplier}px`,
              ...crosshairColorStyle,
            }}
          />
          {/* Bottom Tick */}
          <div
            className="absolute -translate-x-[0.5px]"
            style={{
              top: `${4 * sizeMultiplier}px`,
              left: 0,
              width: '1px',
              height: `${8 * sizeMultiplier}px`,
              ...crosshairColorStyle,
            }}
          />
          {/* Left Tick */}
          <div
            className="absolute -translate-y-[0.5px]"
            style={{
              right: `${4 * sizeMultiplier}px`,
              top: 0,
              width: `${8 * sizeMultiplier}px`,
              height: '1px',
              ...crosshairColorStyle,
            }}
          />
          {/* Right Tick */}
          <div
            className="absolute -translate-y-[0.5px]"
            style={{
              left: `${4 * sizeMultiplier}px`,
              top: 0,
              width: `${8 * sizeMultiplier}px`,
              height: '1px',
              ...crosshairColorStyle,
            }}
          />
          {/* Center Tiny Dot */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: 0,
              top: 0,
              width: '2px',
              height: '2px',
              ...crosshairColorStyle,
            }}
          />
        </div>
      )}
    </>
  )
}
