import { useSettingsStore, type UiStyle } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'

export function UiStyleSettings() {
  const { uiStyle, setUiStyle } = useSettingsStore()
  const preset = uiPresets[uiStyle]

  const styles: { key: UiStyle; label: string; desc: string }[] = [
    { key: 'classic', label: 'Classic', desc: 'Sleek standard interface' },
    { key: 'cute', label: 'Cute ✿', desc: 'Bubbly shapes & emojis' },
    { key: 'hacker', label: 'Terminal', desc: 'Monospace green terminal' },
    { key: 'cyber', label: 'Cyberpunk', desc: 'Glowing neon futuristic' },
    { key: 'retro', label: 'Arcade 🎮', desc: 'Nostalgic 8-bit game console' },
    { key: 'glass', label: 'Glassmorphism', desc: 'Frosted clean transparency' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
        {preset.decorateHeader('Select UI Style')}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((s) => {
          const isActive = uiStyle === s.key
          return (
            <button
              key={s.key}
              onClick={() => setUiStyle(s.key)}
              className={`
                flex flex-col items-center justify-center p-2.5 transition-all duration-200 outline-hidden cursor-pointer text-center gap-0.5
                ${preset.buttonClass(isActive)}
              `}
            >
              <span className="text-[11px] font-bold tracking-wide">{s.label}</span>
              <span className="text-[8px] opacity-60 font-medium leading-none">{s.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
