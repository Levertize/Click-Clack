import { useSettingsStore, type TypingMode, type TypingLanguage } from '../../store/settings'

export function TypingSettings() {
  const {
    typingMode,
    setTypingMode,
    typingLanguage,
    setTypingLanguage,
    testDuration,
    setTestDuration,
  } = useSettingsStore()

  const modes: { key: TypingMode; label: string }[] = [
    { key: 'sandbox', label: 'Sandbox (Free)' },
    { key: 'test', label: 'Typing Test' },
  ]

  const languages: { key: TypingLanguage; label: string }[] = [
    { key: 'english', label: 'English' },
    { key: 'indonesian', label: 'Indonesian' },
  ]

  const durations = [30, 60, 120]

  return (
    <div className="flex flex-col gap-4 py-2">
      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Typing Mode</span>

      {/* Typing Mode Selection */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-1.5">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setTypingMode(m.key)}
              className={`
                py-1.5 px-2 rounded-md border text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                ${typingMode === m.key 
                  ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.01]' 
                  : 'border-[var(--border)] hover:bg-[var(--muted)] opacity-85 hover:opacity-100'
                }
              `}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional settings for Typing Test */}
      {typingMode === 'test' && (
        <>
          {/* Language Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] opacity-75 font-semibold">Language</span>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setTypingLanguage(l.key)}
                  className={`
                    py-1.5 px-2 rounded-md border text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                    ${typingLanguage === l.key 
                      ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.01]' 
                      : 'border-[var(--border)] hover:bg-[var(--muted)] opacity-85 hover:opacity-100'
                    }
                  `}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Duration Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] opacity-75 font-semibold">Duration</span>
            <div className="grid grid-cols-3 gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setTestDuration(d)}
                  className={`
                    py-1.5 px-1 rounded-md border text-[11px] transition-all duration-200 outline-hidden cursor-pointer text-center
                    ${testDuration === d 
                      ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.01]' 
                      : 'border-[var(--border)] hover:bg-[var(--muted)] opacity-85 hover:opacity-100'
                    }
                  `}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
