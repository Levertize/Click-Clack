import { motion } from 'framer-motion'

interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: () => void
}

export function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-2 text-sm text-[var(--fg)]">
      <span>{label}</span>
      <button
        onClick={onChange}
        className="w-11 h-6 rounded-full p-1 relative flex items-center transition-colors duration-300 outline-hidden"
        style={{
          backgroundColor: checked ? 'var(--ui-accent)' : 'var(--muted)',
        }}
      >
        <motion.div
          layout
          className="w-4 h-4 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
      </button>
    </div>
  )
}
