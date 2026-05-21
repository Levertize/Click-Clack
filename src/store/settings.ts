import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeName } from '../themes'

export type Effect = 'particles' | 'explode' | 'ripple' | 'sparks' |
              'constellation' | 'trail' | 'ink' | 'fire'

export type FontKey = 'spaceMono' | 'syneMono' | 'playfair' | 'dmSans'

export interface SettingsState {
  effect: Effect
  intensity: number       // 1–10
  speed: number           // 1–10
  theme: ThemeName
  font: FontKey
  bgParticles: boolean
  rainbowChars: boolean
  panelOpen: boolean

  setEffect: (e: Effect) => void
  setIntensity: (n: number) => void
  setSpeed: (n: number) => void
  setTheme: (t: ThemeName) => void
  setFont: (f: FontKey) => void
  toggleBgParticles: () => void
  toggleRainbowChars: () => void
  togglePanel: () => void
  closePanel: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      effect: 'particles',
      intensity: 5,
      speed: 5,
      theme: 'cyber',
      font: 'dmSans',
      bgParticles: true,
      rainbowChars: false,
      panelOpen: false,

      setEffect: (effect) => set({ effect }),
      setIntensity: (intensity) => set({ intensity }),
      setSpeed: (speed) => set({ speed }),
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      toggleBgParticles: () => set((state) => ({ bgParticles: !state.bgParticles })),
      toggleRainbowChars: () => set((state) => ({ rainbowChars: !state.rainbowChars })),
      togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
      closePanel: () => set({ panelOpen: false }),
    }),
    {
      name: 'aesthetic-typing-settings',
    }
  )
)
