import { useSettingsStore, type CursorStyle, type CursorColorMode, type CursorTrail } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'
import { SliderRow } from './SliderRow'
import { ToggleRow } from './ToggleRow'

export function CursorSettings() {
  const {
    cursorStyle,
    setCursorStyle,
    cursorColorMode,
    setCursorColorMode,
    cursorCustomColor,
    setCursorCustomColor,
    cursorTrail,
    setCursorTrail,
    cursorEasing,
    setCursorEasing,
    cursorClickEffect,
    toggleCursorClickEffect,
    cursorSize,
    setCursorSize,
    uiStyle,
  } = useSettingsStore()

  const preset = uiPresets[uiStyle]

  const styles: { key: CursorStyle; label: string }[] = [
    { key: 'dot-ring', label: 'Dot & Ring' },
    { key: 'ring-only', label: 'Ring Only' },
    { key: 'dot-only', label: 'Dot Only' },
    { key: 'crosshair', label: 'Crosshair' },
    { key: 'none', label: 'System' },
  ]

  const colors: { key: CursorColorMode; label: string }[] = [
    { key: 'accent', label: 'Accent' },
    { key: 'rainbow', label: 'Rainbow' },
    { key: 'invert', label: 'Invert' },
    { key: 'custom', label: 'Custom' },
  ]

  const trails: { key: CursorTrail; label: string }[] = [
    { key: 'none', label: 'No Trail' },
    { key: 'glow-dots', label: 'Glow Dot' },
    { key: 'sparkles', label: 'Stars' },
    { key: 'matrix', label: 'Matrix' },
    { key: 'bubbles', label: 'Bubbles' },
  ]

  return (
    <div className="flex flex-col gap-4 py-2">
      <hr className={preset.dividerClass} />
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
        {preset.decorateHeader('Cursor Customization')}
      </span>

      {/* Cursor Style Option */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Style ✿' : 'Style'}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {styles.map((s) => (
            <button
              key={s.key}
              onClick={() => setCursorStyle(s.key)}
              className={`
                py-1.5 px-2.5 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(cursorStyle === s.key)}
              `}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cursor Color Mode Option */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Color Mode ✿' : 'Color Mode'}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {colors.map((c) => (
            <button
              key={c.key}
              onClick={() => setCursorColorMode(c.key)}
              className={`
                py-1.5 px-1 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(cursorColorMode === c.key)}
              `}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Input Choice */}
      {cursorStyle !== 'none' && cursorColorMode === 'custom' && (
        <div className={`flex items-center gap-3 p-2.5 ${preset.cardBgClass}`}>
          <input
            type="color"
            value={cursorCustomColor}
            onChange={(e) => setCursorCustomColor(e.target.value)}
            className="w-7 h-7 rounded-md border-0 outline-hidden cursor-pointer bg-transparent"
          />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[9px] opacity-60 uppercase font-semibold">Hex Code</span>
            <input
              type="text"
              value={cursorCustomColor}
              onChange={(e) => setCursorCustomColor(e.target.value)}
              className="bg-transparent text-xs font-mono border-b border-[var(--border)] outline-hidden w-full text-[var(--ui-accent)] font-semibold uppercase"
            />
          </div>
        </div>
      )}

      {/* Cursor Trails */}
      {cursorStyle !== 'none' && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] opacity-75 font-semibold">
            {uiStyle === 'cute' ? '✿ Cursor Trail ✿' : 'Cursor Trail'}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {trails.map((t) => (
              <button
                key={t.key}
                onClick={() => setCursorTrail(t.key)}
                className={`
                  py-1.5 px-0.5 text-[10px] transition-all duration-200 outline-hidden cursor-pointer text-center
                  ${preset.buttonClass(cursorTrail === t.key)}
                  ${t.key === 'none' ? 'col-span-3' : ''}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cursor Size scale slider */}
      {cursorStyle !== 'none' && (
        <div className="flex flex-col gap-1">
          <SliderRow
            label="Cursor Size"
            min={1}
            max={5}
            value={cursorSize}
            onChange={setCursorSize}
          />
          
          <SliderRow
            label="Outer Ring Responsiveness"
            min={5}
            max={30}
            value={Math.round(cursorEasing * 100)}
            onChange={(val) => setCursorEasing(val / 100)}
          />
        </div>
      )}

      {/* Cursor Click Ripple Toggle */}
      {cursorStyle !== 'none' && (
        <ToggleRow
          label="Spawn Particles on Click"
          checked={cursorClickEffect}
          onChange={toggleCursorClickEffect}
        />
      )}
    </div>
  )
}

