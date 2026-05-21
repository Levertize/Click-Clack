import { type RefObject, useEffect } from 'react'

export function useCanvas(ref: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const resize = () => {
      if (ref.current) {
        ref.current.width = window.innerWidth
        ref.current.height = window.innerHeight
      }
    }
    
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [ref])
}
