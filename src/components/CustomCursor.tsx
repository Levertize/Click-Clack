import { useCursor } from '../hooks/useCursor'

interface CustomCursorProps {
  focused: boolean
}

export function CustomCursor({ focused }: CustomCursorProps) {
  const { mouseX, mouseY, ringX, ringY } = useCursor()

  const ringSize = focused ? 20 : 36

  return (
    <>
      {/* Outer Ring */}
      <div
        className="custom-cursor fixed pointer-events-none z-50 rounded-full border border-[var(--accent)] transition-[width,height] duration-200 ease-out"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          left: 0,
          top: 0,
          transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Inner Dot */}
      <div
        className="custom-cursor fixed pointer-events-none z-50 w-2 h-2 rounded-full bg-[var(--accent)]"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`,
        }}
      />

      <style>{`
        @media (hover: none) {
          .custom-cursor {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
