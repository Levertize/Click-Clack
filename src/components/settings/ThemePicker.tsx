import { useSettingsStore } from '../../store/settings'
import { themes, type ThemeName } from '../../themes'

export function ThemePicker() {
  const currentTheme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  const themeKeys = Object.keys(themes) as ThemeName[]

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Theme</span>
      <div className="grid grid-cols-3 gap-2">
        {themeKeys.map((key) => {
          const theme = themes[key]
          const isActive = currentTheme === key
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`
                flex flex-col items-center justify-between p-2 rounded-lg border transition-all duration-200 outline-hidden relative cursor-pointer
                ${isActive 
                  ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] scale-[1.03] shadow-md shadow-[var(--accent)]/10' 
                  : 'border-[var(--border)] hover:border-[var(--muted)] hover:scale-[1.02]'
                }
              `}
              style={{
                backgroundColor: theme.bg,
                color: theme.fg,
              }}
            >
              {/* Accents preview circles */}
              <div className="flex gap-1.5 mb-1.5 justify-center">
                {theme.accents.slice(0, 3).map((accent, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {theme.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
