import { useEffect, useState, useRef } from 'react'
import { useSettingsStore } from '../store/settings'

export function useCursor() {
  const [pos, setPos] = useState({ mouseX: 0, mouseY: 0, ringX: 0, ringY: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const ringRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Initial centering to avoid visual snap from (0,0)
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    ringRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animFrame: number
    const tick = () => {
      const mouse = mouseRef.current
      const ring = ringRef.current

      // Retrieve easing rate dynamically from state
      const easing = useSettingsStore.getState().cursorEasing

      // Smooth interpolation for the ring
      ring.x += (mouse.x - ring.x) * easing
      ring.y += (mouse.y - ring.y) * easing

      setPos({
        mouseX: mouse.x,
        mouseY: mouse.y,
        ringX: ring.x,
        ringY: ring.y,
      })

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return pos
}
