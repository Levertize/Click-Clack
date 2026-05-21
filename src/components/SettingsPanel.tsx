import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSettingsStore } from '../store/settings'
import { EffectPicker } from './settings/EffectPicker'
import { ThemePicker } from './settings/ThemePicker'
import { FontPicker } from './settings/FontPicker'
import { SliderRow } from './settings/SliderRow'
import { ToggleRow } from './settings/ToggleRow'

export function SettingsPanel() {
  const panelOpen = useSettingsStore((state) => state.panelOpen)
  const closePanel = useSettingsStore((state) => state.closePanel)

  const {
    intensity,
    setIntensity,
    speed,
    setSpeed,
    bgParticles,
    toggleBgParticles,
    rainbowChars,
    toggleRainbowChars,
  } = useSettingsStore()

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Backdrop Click Shield to close panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
          />

          {/* Settings Panel Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed top-0 right-0 h-full w-[320px] max-w-full z-45 flex flex-col shadow-2xl border-l select-none overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg2)',
              borderColor: 'var(--border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: 'var(--fg)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <span className="font-bold tracking-wider text-sm uppercase">Configuration</span>
              <button
                onClick={closePanel}
                className="p-1 rounded-md hover:bg-[var(--border)] transition-colors opacity-80 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Settings */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-12">
              {/* Effect Picker */}
              <EffectPicker />

              {/* Theme Picker */}
              <ThemePicker />

              {/* Font Picker */}
              <FontPicker />

              <hr className="border-[var(--border)]" />

              {/* Sliders */}
              <div className="flex flex-col gap-3">
                <SliderRow
                  label="Effect Intensity"
                  min={1}
                  max={10}
                  value={intensity}
                  onChange={setIntensity}
                />
                <SliderRow
                  label="Effect Speed"
                  min={1}
                  max={10}
                  value={speed}
                  onChange={setSpeed}
                />
              </div>

              <hr className="border-[var(--border)]" />

              {/* Toggles */}
              <div className="flex flex-col gap-1.5">
                <ToggleRow
                  label="Ambient Background Dots"
                  checked={bgParticles}
                  onChange={toggleBgParticles}
                />
                <ToggleRow
                  label="Rainbow Characters"
                  checked={rainbowChars}
                  onChange={toggleRainbowChars}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
