import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeName } from '../themes'

export type Effect = 'particles' | 'explode' | 'ripple' | 'sparks' |
              'constellation' | 'trail' | 'ink' | 'fire'

export type FontKey = 'spaceMono' | 'syneMono' | 'playfair' | 'dmSans'

export type CursorStyle = 'dot-ring' | 'ring-only' | 'dot-only' | 'crosshair' | 'none'
export type CursorColorMode = 'accent' | 'rainbow' | 'invert' | 'custom'
export type CursorTrail = 'none' | 'glow-dots' | 'sparkles' | 'matrix' | 'bubbles'
export type SoundEffect = 'none' | 'blue-switch' | 'brown-switch' | 'typewriter' | 'arcade-pop'
export type BgStyle = 'bokeh' | 'starfield' | 'grid' | 'matrix'
export type BgInteraction = 'none' | 'repel' | 'gravity'
export type TypingMode = 'sandbox' | 'test'
export type TypingLanguage = 'english' | 'indonesian'

export interface SettingsState {
  effect: Effect
  intensity: number       // 1–10
  speed: number           // 1–10
  theme: ThemeName
  font: FontKey
  bgParticles: boolean
  rainbowChars: boolean
  panelOpen: boolean
  
  // Custom Cursor variables
  cursorStyle: CursorStyle
  cursorColorMode: CursorColorMode
  cursorCustomColor: string // hex code
  cursorTrail: CursorTrail
  cursorEasing: number      // 0.05 - 0.3
  cursorClickEffect: boolean
  cursorSize: number      // 1–5 (default 3)

  // Interactive enhancements
  soundEffect: SoundEffect
  soundVolume: number      // 1–10
  soundPitch: number       // 1–10
  screenShake: number      // 0–10

  // Background customizer variables
  bgStyle: BgStyle
  bgInteraction: BgInteraction
  bgCount: number          // 20-150
  bgSpeed: number          // 1-10

  // Typing test settings
  typingMode: TypingMode
  typingLanguage: TypingLanguage
  testDuration: number     // in seconds

  setEffect: (e: Effect) => void
  setIntensity: (n: number) => void
  setSpeed: (n: number) => void
  setTheme: (t: ThemeName) => void
  setFont: (f: FontKey) => void
  toggleBgParticles: () => void
  toggleRainbowChars: () => void
  togglePanel: () => void
  closePanel: () => void
  
  // Custom Cursor actions
  setCursorStyle: (s: CursorStyle) => void
  setCursorColorMode: (m: CursorColorMode) => void
  setCursorCustomColor: (c: string) => void
  setCursorTrail: (t: CursorTrail) => void
  setCursorEasing: (e: number) => void
  toggleCursorClickEffect: () => void
  setCursorSize: (n: number) => void

  // Interactive setters
  setSoundEffect: (s: SoundEffect) => void
  setSoundVolume: (v: number) => void
  setSoundPitch: (p: number) => void
  setScreenShake: (s: number) => void

  // Background setters
  setBgStyle: (s: BgStyle) => void
  setBgInteraction: (i: BgInteraction) => void
  setBgCount: (n: number) => void
  setBgSpeed: (n: number) => void

  // Typing test setters
  setTypingMode: (m: TypingMode) => void
  setTypingLanguage: (l: TypingLanguage) => void
  setTestDuration: (d: number) => void
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

      // Custom Cursor defaults
      cursorStyle: 'dot-ring',
      cursorColorMode: 'accent',
      cursorCustomColor: '#00ff9d',
      cursorTrail: 'none',
      cursorEasing: 0.14,
      cursorClickEffect: true,
      cursorSize: 3,

      // Interactives defaults
      soundEffect: 'none',
      soundVolume: 5,
      soundPitch: 5,
      screenShake: 0,

      // Background customizer defaults
      bgStyle: 'bokeh',
      bgInteraction: 'repel',
      bgCount: 60,
      bgSpeed: 3,

      // Typing test defaults
      typingMode: 'sandbox',
      typingLanguage: 'english',
      testDuration: 60,

      setEffect: (effect) => set({ effect }),
      setIntensity: (intensity) => set({ intensity }),
      setSpeed: (speed) => set({ speed }),
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      toggleBgParticles: () => set((state) => ({ bgParticles: !state.bgParticles })),
      toggleRainbowChars: () => set((state) => ({ rainbowChars: !state.rainbowChars })),
      togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
      closePanel: () => set({ panelOpen: false }),

      // Custom Cursor setters
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setCursorColorMode: (cursorColorMode) => set({ cursorColorMode }),
      setCursorCustomColor: (cursorCustomColor) => set({ cursorCustomColor }),
      setCursorTrail: (cursorTrail) => set({ cursorTrail }),
      setCursorEasing: (cursorEasing) => set({ cursorEasing }),
      toggleCursorClickEffect: () => set((state) => ({ cursorClickEffect: !state.cursorClickEffect })),
      setCursorSize: (cursorSize) => set({ cursorSize }),

      // Interactive setters
      setSoundEffect: (soundEffect) => set({ soundEffect }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setSoundPitch: (soundPitch) => set({ soundPitch }),
      setScreenShake: (screenShake) => set({ screenShake }),

      // Background setters
      setBgStyle: (bgStyle) => set({ bgStyle }),
      setBgInteraction: (bgInteraction) => set({ bgInteraction }),
      setBgCount: (bgCount) => set({ bgCount }),
      setBgSpeed: (bgSpeed) => set({ bgSpeed }),

      // Typing test setters
      setTypingMode: (typingMode) => set({ typingMode }),
      setTypingLanguage: (typingLanguage) => set({ typingLanguage }),
      setTestDuration: (testDuration) => set({ testDuration }),
    }),
    {
      name: 'aesthetic-typing-settings-v4', // bumped version to avoid localstorage collisions
    }
  )
)
