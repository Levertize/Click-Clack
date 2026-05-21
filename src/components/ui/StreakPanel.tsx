import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Activity } from 'lucide-react'

interface StreakPanelProps {
  hidden: boolean
}

export function StreakPanel({ hidden }: StreakPanelProps) {
  const [streak, setStreak] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [progress, setProgress] = useState(0) // 0 to 100 for visual draining

  const lastKeyTime = useRef(Date.now())
  const keystrokeTimes = useRef<number[]>([])
  const streakRef = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'Tab'].includes(e.key)) {
        return
      }

      // Check for printable/typing characters
      const isPrintable = e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace'
      if (!isPrintable) return

      const now = Date.now()
      lastKeyTime.current = now

      // 1. Update streak
      streakRef.current += 1
      setStreak(streakRef.current)
      setProgress(100)

      // 2. Update WPM tracking
      keystrokeTimes.current.push(now)
    }

    window.addEventListener('keydown', handleKeyDown)

    // Animation loop to drain combo bar and update WPM
    let animFrame: number
    const tick = () => {
      const now = Date.now()
      
      // Calculate WPM: characters typed in last 5 seconds
      keystrokeTimes.current = keystrokeTimes.current.filter((t) => now - t < 5000)
      const calculatedWpm = Math.round(keystrokeTimes.current.length * 2.4)
      setWpm(calculatedWpm)

      // Drain progress bar based on time elapsed since last keystroke (decay after 1.5s)
      const elapsed = now - lastKeyTime.current
      const decayTime = 1600 // 1.6s to drain completely
      
      if (streakRef.current > 0) {
        const remaining = Math.max(0, 100 - (elapsed / decayTime) * 100)
        setProgress(remaining)

        if (remaining <= 0) {
          streakRef.current = 0
          setStreak(0)
        }
      }

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  if (hidden) return null

  // Determine aesthetic styles based on streak milestones
  const getStreakTier = (s: number) => {
    if (s >= 35) return { color: 'text-red-500 shadow-red-500/50', label: 'SUPERCELL! ⚡', bg: 'bg-red-500' }
    if (s >= 20) return { color: 'text-amber-500 shadow-amber-500/40', label: 'ON FIRE 🔥', bg: 'bg-amber-500' }
    if (s >= 8) return { color: 'text-purple-500 shadow-purple-500/30', label: 'COMBO 🌟', bg: 'bg-purple-500' }
    return { color: 'text-[var(--accent)]', label: 'STREAK', bg: 'bg-[var(--accent)]' }
  }

  const tier = getStreakTier(streak)

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2 font-mono">
      {/* 1. Real-time WPM Gauge */}
      {wpm > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex items-center gap-2 bg-[var(--bg2)]/60 backdrop-blur-md border border-[var(--border)] px-3 py-1.5 rounded-lg text-xs"
        >
          <Activity size={12} className="text-[var(--accent)] animate-pulse" />
          <span className="opacity-60">SPEED:</span>
          <span className="font-bold text-[var(--accent)]">{wpm} WPM</span>
        </motion.div>
      )}

      {/* 2. Combo Streak UI */}
      <AnimatePresence>
        {streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col gap-1 bg-[var(--bg2)]/80 backdrop-blur-lg border border-[var(--border)] p-3 rounded-xl min-w-[140px] shadow-lg"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-semibold opacity-60">
              <span>{tier.label}</span>
              <Flame size={10} className={tier.color} />
            </div>

            {/* Streak Number */}
            <motion.div
              key={streak}
              initial={{ scale: 1.2, filter: 'brightness(1.5)' }}
              animate={{ scale: 1, filter: 'brightness(1)' }}
              className={`text-2xl font-black ${tier.color} drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]`}
            >
              x{streak}
            </motion.div>

            {/* Draining Progress Bar */}
            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden mt-1">
              <div
                className={`h-full ${tier.bg} transition-all duration-75 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
