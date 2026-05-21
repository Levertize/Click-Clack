interface CharCounterProps {
  count: number
  hidden: boolean
}

export function CharCounter({ count, hidden }: CharCounterProps) {
  if (hidden || count === 0) return null

  return (
    <div className="fixed bottom-6 right-8 font-mono text-xs md:text-sm opacity-40 tracking-wider select-none pointer-events-none transition-all duration-300 z-20">
      {count} {count === 1 ? 'char' : 'chars'}
    </div>
  )
}
