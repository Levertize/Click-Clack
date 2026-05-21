import { useSettingsStore } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'

interface HintTextProps {
  faded: boolean
}

export function HintText({ faded }: HintTextProps) {
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const preset = uiPresets[uiStyle]

  return (
    <div
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none select-none text-xs md:text-sm font-medium tracking-wider flex items-center gap-4 md:gap-5 z-20 ${
        faded ? 'opacity-0 -translate-y-2' : 'opacity-45'
      } ${preset.fontClassOverride || ''}`}
    >
      <span>
        <kbd className={preset.keycapClass}>Ctrl</kbd> + <kbd className={preset.keycapClass}>,</kbd> settings
      </span>
      <span className="opacity-30">{preset.hintSeparator}</span>
      <span>
        <kbd className={preset.keycapClass}>Ctrl</kbd> + <kbd className={preset.keycapClass}>Backspace</kbd> clear
      </span>
      <span className="opacity-30">{preset.hintSeparator}</span>
      <span>
        <kbd className={preset.keycapClass}>Ctrl</kbd> + <kbd className={preset.keycapClass}>Shift</kbd> + <kbd className={preset.keycapClass}>R</kbd> random theme
      </span>
    </div>
  )
}
