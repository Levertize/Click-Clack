import { useSettingsStore, type SoundEffect } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'
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
    uiStyle,
  } = useSettingsStore()

  const preset = uiPresets[uiStyle]

  const presets: { key: SoundEffect; label: string }[] = [
    { key: 'none', label: 'Mute' },
    { key: 'blue-switch', label: 'Blue click' },
    { key: 'brown-switch', label: 'Creamy thock' },
    { key: 'typewriter', label: 'Typewriter' },
    { key: 'arcade-pop', label: 'Arcade Pop' },
  ]

  return (
    <div className="flex flex-col gap-4 py-2">
      <hr className={preset.dividerClass} />
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
        {preset.decorateHeader('Audio & Feedback')}
      </span>

      {/* Sound Effect Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Keystroke Sounds ✿' : 'Keystroke Sounds'}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setSoundEffect(p.key)}
              className={`
                py-1.5 px-2 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(soundEffect === p.key)}
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

