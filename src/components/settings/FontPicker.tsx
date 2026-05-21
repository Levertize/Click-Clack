import { useSettingsStore, type FontKey } from '../../store/settings'

export function FontPicker() {
  const currentFont = useSettingsStore((state) => state.font)
  const setFont = useSettingsStore((state) => state.setFont)

  const fonts: { key: FontKey; label: string; className: string }[] = [
    { key: 'dmSans', label: 'DM Sans', className: 'font-dm-sans' },
    { key: 'spaceMono', label: 'Space Mono', className: 'font-space-mono' },
    { key: 'syneMono', label: 'Syne Mono', className: 'font-syne-mono' },
    { key: 'playfair', label: 'Playfair Display', className: 'font-playfair' },
  ]

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Font Family</span>
      <div className="flex flex-col gap-1">
        {fonts.map((f) => (
          <button
            key={f.key}
            onClick={() => setFont(f.key)}
            className={`
              w-full text-left py-2 px-3 rounded-md text-[0.9rem] transition-all duration-200 outline-hidden
              ${f.className}
              ${currentFont === f.key 
                ? 'bg-[var(--muted)] text-[var(--accent)] font-bold border-l-2 border-[var(--accent)]' 
                : 'hover:bg-[var(--muted)] opacity-80 hover:opacity-100'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
