import { useSettingsStore, type TypingLanguage } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'

export function TypingSettings() {
  const {
    typingMode,
    typingLanguage,
    setTypingLanguage,
    testDuration,
    setTestDuration,
    uiStyle,
  } = useSettingsStore()
  
  const preset = uiPresets[uiStyle]

  const languages: { key: TypingLanguage; label: string }[] = [
    { key: 'english', label: 'English' },
    { key: 'indonesian', label: 'Indonesian' },
  ]

  const durations = [30, 60, 120]

  if (typingMode !== 'test') return null

  return (
    <div className="flex flex-col gap-4 py-2">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
        {preset.decorateHeader('Typing Test Options')}
      </span>

      {/* Language Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Language ✿' : 'Language'}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {languages.map((l) => (
            <button
              key={l.key}
              onClick={() => setTypingLanguage(l.key)}
              className={`
                py-1.5 px-2 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(typingLanguage === l.key)}
              `}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test Duration Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] opacity-75 font-semibold">
          {uiStyle === 'cute' ? '✿ Duration ✿' : 'Duration'}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setTestDuration(d)}
              className={`
                py-1.5 px-1 text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${preset.buttonClass(testDuration === d)}
              `}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
