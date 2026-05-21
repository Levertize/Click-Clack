import { useSettingsStore, type SoundEffect } from '../../store/settings'
import { SliderRow } from './SliderRow'

export function AudioSettings() {
  const {
    soundEffect,
    setSoundEffect,
    soundVolume,
    setSoundVolume,
    soundPitch,
    setSoundPitch,
    screenShake,
    setScreenShake,
  } = useSettingsStore()

  const presets: { key: SoundEffect; label: string }[] = [
    { key: 'none', label: 'Mute' },
    { key: 'blue-switch', label: 'Blue click' },
    { key: 'brown-switch', label: 'Creamy thock' },
    { key: 'typewriter', label: 'Typewriter' },
    { key: 'arcade-pop', label: 'Arcade Pop' },
  ]

  return (
    <div className="flex flex-col gap-4 py-2">
      <hr className="border-[var(--border)]" />
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Audio & Feedback</span>

      {/* Sound Effect Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">Keystroke Sounds</span>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setSoundEffect(p.key)}
              className={`
                py-1.5 px-2 rounded-md border text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${soundEffect === p.key 
                  ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.01]' 
                  : 'border-[var(--border)] hover:bg-[var(--muted)] opacity-85 hover:opacity-100'
                }
                ${p.key === 'none' ? 'col-span-2' : ''}
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volume and Pitch sliders */}
      {soundEffect !== 'none' && (
        <div className="flex flex-col gap-3">
          <SliderRow
            label="Sound Volume"
            min={1}
            max={10}
            value={soundVolume}
            onChange={setSoundVolume}
          />
          <SliderRow
            label="Sound Pitch"
            min={1}
            max={10}
            value={soundPitch}
            onChange={setSoundPitch}
          />
        </div>
      )}

      {/* Screen Shake Intensity */}
      <SliderRow
        label="Screen Shake Intensity"
        min={0}
        max={10}
        value={screenShake}
        onChange={setScreenShake}
      />
    </div>
  )
}
