interface HintTextProps {
  faded: boolean
}

export function HintText({ faded }: HintTextProps) {
  return (
    <div
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none select-none text-xs md:text-sm font-medium tracking-wider flex gap-4 md:gap-5 z-20 ${
        faded ? 'opacity-0 -translate-y-2' : 'opacity-40'
      }`}
    >
      <span><kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">,</kbd> settings</span>
      <span className="opacity-30">|</span>
      <span><kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">Backspace</kbd> clear</span>
      <span className="opacity-30">|</span>
      <span><kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--muted)]">R</kbd> random theme</span>
    </div>
  )
}
