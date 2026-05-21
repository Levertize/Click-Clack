import { Settings } from 'lucide-react'

interface ToggleButtonProps {
  onClick: () => void
}

export function ToggleButton({ onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] hover:scale-105 active:scale-95 transition-all duration-200 z-30 cursor-pointer shadow-xs"
      style={{
        backgroundColor: 'var(--bg2)',
        color: 'var(--fg)',
      }}
      title="Toggle Settings (Ctrl + ,)"
    >
      <Settings size={16} />
    </button>
  )
}
