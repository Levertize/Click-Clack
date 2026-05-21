import { useSettingsStore, type BgStyle, type BgInteraction } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'
import { SliderRow } from './SliderRow'

export function BgSettings() {
  const {
    bgParticles,
    bgStyle,
    setBgStyle,
    bgInteraction,
    setBgInteraction,
    bgCount,
    setBgCount,
    bgSpeed,
    setBgSpeed,
    uiStyle,
  } = useSettingsStore()

  const preset = uiPresets[uiStyle]

  const styles: { key: BgStyle; label: string }[] = [
    { key: 'bokeh', label: 'Bokeh Dots' },
    { key: 'starfield', label: 'Starfield' },
    { key: 'grid', label: 'Elastic Grid' },
    { key: 'matrix', label: 'Matrix Rain' },
  ]

  const interactions: { key: BgInteraction; label: string }[] = [
    { key: 'none', label: 'No Force' },
    { key: 'repel', label: 'Repel' },
    { key: 'gravity', label: 'Gravity' },
  ]

  // If ambient background is disabled, we gray out and lock these options
  return (
    <div className={`flex flex-col gap-4 py-2 transition-opacity duration-300 ${!bgParticles ? 'opacity-40 pointer-events-none' : ''}`}>
      <hr className={preset.dividerClass} />
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
          {preset.decorateHeader('Background FX')}
        </span>
        {!bgParticles && (
          <span className="text-[9px] text-[var(--accent)] font-semibold uppercase tracking-wider animate-pulse">Disabled</span>
        )}
      </div>

      {/* Style Choices */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Aesthetic Style ✿' : 'Aesthetic Style'}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {styles.map((s) => (
            <button
              key={s.key}
              onClick={() => setBgStyle(s.key)}
              disabled={!bgParticles}
              className={`
                py-1.5 px-2 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(bgStyle === s.key)}
              `}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mouse Attraction/Repulsion Force Field */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Mouse Interaction Field ✿' : 'Mouse Interaction Field'}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {interactions.map((i) => (
            <button
              key={i.key}
              onClick={() => setBgInteraction(i.key)}
              disabled={!bgParticles}
              className={`
                py-1.5 px-1 text-[10px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(bgInteraction === i.key)}
              `}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders for Quantity and Speed */}
      {bgStyle !== 'grid' && (
        <SliderRow
          label="Particle / Stream Count"
          min={20}
          max={150}
          value={bgCount}
          onChange={setBgCount}
        />
      )}

      <SliderRow
        label="Background Speed"
        min={1}
        max={10}
        value={bgSpeed}
        onChange={setBgSpeed}
      />
    </div>
  )
}

