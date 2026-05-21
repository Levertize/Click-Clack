import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSettingsStore } from '../store/settings'
import { uiPresets } from '../utils/stylePresets'
import { UiStyleSettings } from './settings/UiStyleSettings'
import { ToggleRow } from './settings/ToggleRow'

export function UiPanel() {
  const uiPanelOpen = useSettingsStore((state) => state.uiPanelOpen)
  const closeUiPanel = useSettingsStore((state) => state.closeUiPanel)
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const showWatermark = useSettingsStore((state) => state.showWatermark)
  const toggleShowWatermark = useSettingsStore((state) => state.toggleShowWatermark)
  
  const preset = uiPresets[uiStyle]

  return (
    <AnimatePresence>
      {uiPanelOpen && (
        <>
          {/* Backdrop Click Shield to close panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeUiPanel}
            className="fixed inset-0 z-40 bg-black/30"
          />

          {/* UI Customizer Panel Content (Slides in from Left) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className={`fixed top-0 left-0 h-full w-[320px] max-w-full z-45 flex flex-col shadow-2xl border-r select-none overflow-y-auto transition-all duration-300 ${preset.panelContainerClass} ${preset.fontClassOverride || ''}`}
            style={{
              willChange: 'transform',
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${preset.dividerClass}`}>
              <span className={preset.panelHeaderClass}>
                {preset.decorateHeader('UI Customizer')}
              </span>
              <button
                onClick={closeUiPanel}
                className="p-1 rounded-md hover:bg-[var(--border)] transition-colors opacity-85 hover:opacity-100 cursor-pointer text-current"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Settings */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-12">
              
              {/* UI Style Selection Preset Grid */}
              <UiStyleSettings />

              <hr className={preset.dividerClass} />

              {/* Watermark/Logo visibility setting */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
                  {preset.decorateHeader('Brand Visibility')}
                </span>
                <ToggleRow
                  label="Show Logo Watermark"
                  checked={showWatermark}
                  onChange={toggleShowWatermark}
                />
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
