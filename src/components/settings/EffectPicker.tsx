import { useSettingsStore, type Effect } from '../../store/settings'
import { Sparkles, Bomb, Waves, Zap, GitCommit, Wind, Droplet, Flame } from 'lucide-react'

export function EffectPicker() {
  const currentEffect = useSettingsStore((state) => state.effect)
  const setEffect = useSettingsStore((state) => state.setEffect)

  const effects: { key: Effect; label: string; icon: React.ComponentType<any> }[] = [
    { key: 'particles', label: 'Particles', icon: Sparkles },
    { key: 'explode', label: 'Explode', icon: Bomb },
    { key: 'ripple', label: 'Ripple', icon: Waves },
    { key: 'sparks', label: 'Sparks', icon: Zap },
    { key: 'constellation', label: 'Constellation', icon: GitCommit },
    { key: 'trail', label: 'Trail', icon: Wind },
    { key: 'ink', label: 'Ink Blots', icon: Droplet },
    { key: 'fire', label: 'Fire', icon: Flame },
  ]

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Keystroke Effect</span>
      <div className="grid grid-cols-2 gap-2">
        {effects.map((eff) => {
          const Icon = eff.icon
          const isActive = currentEffect === eff.key
          return (
            <button
              key={eff.key}
              onClick={() => setEffect(eff.key)}
              className={`
                flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-200 outline-hidden text-left cursor-pointer
                ${isActive 
                  ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.02]' 
                  : 'border-[var(--border)] hover:bg-[var(--muted)] opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }
              `}
            >
              <Icon size={15} className={isActive ? 'text-[var(--accent)]' : 'opacity-70'} />
              <span className="text-xs tracking-wide">{eff.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
