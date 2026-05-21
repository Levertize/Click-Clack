import { useSettingsStore } from '../../store/settings'
import { uiPresets } from '../../utils/stylePresets'
import { motion } from 'framer-motion'

export function LogoHeader() {
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const preset = uiPresets[uiStyle]

  // Render content depending on uiStyle
  const renderLogo = () => {
    switch (uiStyle) {
      case 'cute':
        return (
          <div className="flex flex-col items-center select-none font-sans">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="text-4xl md:text-5xl font-black text-pink-500 dark:text-pink-400 drop-shadow-[0_2px_4px_rgba(244,143,177,0.3)] tracking-wide"
            >
              (◕‿◕✿) <span className="underline decoration-pink-300 decoration-wavy decoration-3 underline-offset-8">click-clack</span>
            </motion.h1>
            <span className="text-xs text-pink-400/80 font-bold tracking-wide mt-2">
              ✿ type with love and cute sounds ✿
            </span>
          </div>
        )
      case 'hacker':
        return (
          <div className="flex flex-col items-center select-none font-mono text-emerald-400">
            <div className="flex items-center gap-1.5 text-xl md:text-2xl font-bold tracking-tight bg-black px-4 py-2 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span>guest@click-clack:~$ ./cc.sh</span>
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2.5 h-5 bg-emerald-400"
              />
            </div>
            <span className="text-[10px] text-emerald-500/70 font-semibold tracking-widest uppercase mt-2.5">
              [terminal version v4.0.0-beta]
            </span>
          </div>
        )
      case 'cyber':
        return (
          <div className="flex flex-col items-center select-none font-mono uppercase tracking-wider">
            <motion.h1 
              className="text-4xl md:text-5xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] skew-x-3 italic relative"
              animate={{
                textShadow: [
                  '0 0 4px #06b6d4, 0 0 10px #06b6d4',
                  '0 0 2px #06b6d4, 0 0 5px #06b6d4',
                  '0 0 4px #06b6d4, 0 0 10px #06b6d4'
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚡ CLICK-CLACK.EXE //
            </motion.h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-cyan-400/50 font-bold px-2 py-0.5 border border-cyan-500/30">
                SYSTEM_READY
              </span>
              <span className="text-[10px] text-magenta-500/70 font-bold px-2 py-0.5 border border-magenta-500/30 text-pink-500">
                INTENSITY_MONITOR
              </span>
            </div>
          </div>
        )
      case 'retro':
        return (
          <div className="flex flex-col items-center select-none font-mono uppercase tracking-widest">
            <motion.h1 
              className="text-3xl md:text-4xl font-extrabold text-yellow-500 bg-zinc-950 border-4 border-yellow-600 px-6 py-2 shadow-[4px_4px_0px_#d97706]"
              animate={{ opacity: [1, 0.85, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ★ INSERT COIN ★
            </motion.h1>
            <span className="text-xs text-yellow-500 font-bold mt-3 animate-pulse bg-zinc-950 px-2.5 py-1 border border-yellow-600/30">
              1UP PLAY FOR FREE 🎮
            </span>
          </div>
        )
      case 'glass':
        return (
          <div className="flex flex-col items-center select-none font-sans">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white/90 tracking-tight drop-shadow-md">
              click<span className="text-white/40 font-light">clack</span>
            </h1>
            <span className="text-xs text-white/50 font-medium tracking-widest uppercase mt-2">
              translucent sound experience
            </span>
          </div>
        )
      case 'classic':
      default:
        return (
          <div className="flex flex-col items-center select-none">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-[var(--fg)] to-[var(--fg)]/80 bg-clip-text text-transparent">
              click-clack
            </h1>
            <span className="text-xs text-[var(--fg)] opacity-50 tracking-wider mt-1.5 font-medium">
              mechanical typing simulator
            </span>
          </div>
        )
    }
  }

  return (
    <div className={`flex justify-center transition-all duration-300 ${preset.fontClassOverride || ''}`}>
      {renderLogo()}
    </div>
  )
}
