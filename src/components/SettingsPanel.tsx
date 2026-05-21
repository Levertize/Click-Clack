import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSettingsStore } from '../store/settings'
import { uiPresets } from '../utils/stylePresets'
import { EffectPicker } from './settings/EffectPicker'
import { ThemePicker } from './settings/ThemePicker'
import { FontPicker } from './settings/FontPicker'
import { SliderRow } from './settings/SliderRow'
import { ToggleRow } from './settings/ToggleRow'
import { AudioSettings } from './settings/AudioSettings'
import { CursorSettings } from './settings/CursorSettings'
import { BgSettings } from './settings/BgSettings'
import { TypingSettings } from './settings/TypingSettings'

export function SettingsPanel() {
  const panelOpen = useSettingsStore((state) => state.panelOpen)
  const closePanel = useSettingsStore((state) => state.closePanel)
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const preset = uiPresets[uiStyle]

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
            className="fixed inset-0 z-40 bg-black/30"
          />

          {/* Settings Panel Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className={`fixed top-0 right-0 h-full w-[320px] max-w-full z-45 flex flex-col shadow-2xl border-l select-none overflow-y-auto transition-all duration-300 ${preset.panelContainerClass} ${preset.fontClassOverride || ''}`}
            style={{
              willChange: 'transform',
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${preset.dividerClass}`}>
              <span className={preset.panelHeaderClass}>
                {preset.decorateHeader('Configuration')}
              </span>
              <button
                onClick={closePanel}
                className="p-1 rounded-md hover:bg-[var(--border)] transition-colors opacity-85 hover:opacity-100 cursor-pointer text-current"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Settings */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-12">
              {/* Typing Mode Selection */}
              <TypingSettings />

              {/* Effect Picker */}
              <EffectPicker />

              {/* Theme Picker */}
              <ThemePicker />

              {/* Font Picker */}
              <FontPicker />

              <hr className={preset.dividerClass} />

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

              <hr className={preset.dividerClass} />

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

              {/* Audio & Feedback Options */}
              <AudioSettings />

              {/* Cursor Customization Options */}
              <CursorSettings />

              {/* Background FX Options */}
              <BgSettings />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

