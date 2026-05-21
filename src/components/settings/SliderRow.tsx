interface SliderRowProps {
  label: string
  min: number
  max: number
  value: number
  onChange: (val: number) => void
}

export function SliderRow({ label, min, max, value, onChange }: SliderRowProps) {
  return (
    <div className="flex flex-col gap-1.5 py-2 text-sm text-[var(--fg)]">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <span className="font-mono text-xs text-[var(--ui-accent)] font-bold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer outline-hidden transition-all"
        style={{ accentColor: 'var(--ui-accent)' }}
      />
    </div>
  )
}
