import type { UiStyle } from '../store/settings'

export interface UiPreset {
  key: UiStyle
  decorateHeader: (text: string) => string
  editorCardClass: string
  logoText: string
  logoSub: string
  keycapClass: string
  hintSeparator: string
  fontClassOverride?: string
  panelContainerClass: string
  panelHeaderClass: string
  dividerClass: string
  buttonClass: (isActive: boolean) => string
  cardBgClass: string
}

export const uiPresets: Record<UiStyle, UiPreset> = {
  classic: {
    key: 'classic',
    decorateHeader: (t) => t,
    editorCardClass: 'border border-[var(--border)] bg-[var(--bg2)]/60 rounded-xl shadow-lg',
    logoText: 'click-clack',
    logoSub: 'mechanical typing simulator',
    keycapClass: 'px-1.5 py-0.5 rounded-md bg-[var(--muted)] border border-[var(--border)] font-sans',
    hintSeparator: '|',
    panelContainerClass: 'bg-[var(--bg2)] border-l border-[var(--border)]',
    panelHeaderClass: 'font-bold tracking-wider text-sm uppercase',
    dividerClass: 'border-[var(--border)]',
    buttonClass: (isActive) =>
      `rounded-lg border transition-all duration-200 ${
        isActive
          ? 'border-[var(--accent)] bg-[var(--muted)] text-[var(--accent)] font-semibold scale-[1.01]'
          : 'border-[var(--border)] hover:bg-[var(--muted)]/20 hover:border-[var(--fg)]/30'
      }`,
    cardBgClass: 'bg-[var(--bg2)]/40 border border-[var(--border)]',
  },
  cute: {
    key: 'cute',
    decorateHeader: (t) => `✿ ${t} ✿`,
    editorCardClass: 'border-4 border-pink-300/40 bg-pink-100/5 dark:bg-pink-950/5 rounded-[2.5rem] shadow-[0_12px_36px_rgba(244,143,177,0.12)]',
    logoText: '(◕‿◕✿) click-clack',
    logoSub: '✿ type with love and cute sounds ✿',
    keycapClass: 'px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800/30 font-sans font-bold',
    hintSeparator: '✿',
    fontClassOverride: 'font-sans font-medium',
    panelContainerClass: 'bg-pink-50/95 dark:bg-zinc-950/95 border-l-4 border-pink-300/60 rounded-l-[2rem] shadow-2xl',
    panelHeaderClass: 'font-extrabold tracking-wider text-sm text-pink-500 dark:text-pink-400 font-sans',
    dividerClass: 'border-pink-200 dark:border-pink-800/40',
    buttonClass: (isActive) =>
      `rounded-2xl border-2 transition-all duration-300 ${
        isActive
          ? 'border-pink-400 bg-pink-200/50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 font-extrabold scale-[1.03] shadow-md shadow-pink-200/20'
          : 'border-pink-100 dark:border-zinc-800 hover:bg-pink-100/40 dark:hover:bg-zinc-900/50 hover:scale-[1.01] text-pink-700/80 dark:text-zinc-400'
      }`,
    cardBgClass: 'bg-pink-200/10 dark:bg-pink-950/15 border-2 border-pink-200/30 dark:border-pink-900/30 rounded-2xl',
  },
  hacker: {
    key: 'hacker',
    decorateHeader: (t) => `$ cat ${t.toLowerCase().replace(/[^a-z0-9]/g, '_')}.log`,
    editorCardClass: 'border-2 border-emerald-500/80 bg-black/90 rounded-none shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    logoText: 'guest@click-clack:~$ ./cc.sh',
    logoSub: '[terminal version v4.0.0-beta]',
    keycapClass: 'px-1.5 py-0.5 rounded-none bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 font-mono text-xs',
    hintSeparator: '::',
    fontClassOverride: 'font-mono',
    panelContainerClass: 'bg-black border-l-2 border-emerald-500 font-mono text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.05)]',
    panelHeaderClass: 'font-mono text-emerald-400 text-xs font-bold uppercase tracking-wider border-b border-emerald-950 pb-2',
    dividerClass: 'border-emerald-950/70',
    buttonClass: (isActive) =>
      `rounded-none border transition-all duration-150 font-mono text-[10px] uppercase ${
        isActive
          ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]'
          : 'border-emerald-950 text-emerald-600 hover:border-emerald-500/60 hover:bg-emerald-950/20'
      }`,
    cardBgClass: 'bg-black border border-emerald-500/30 rounded-none font-mono',
  },
  cyber: {
    key: 'cyber',
    decorateHeader: (t) => `// ${t.toUpperCase()} //`,
    editorCardClass: 'border border-cyan-500/70 bg-slate-950/85 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_0_10px_rgba(6,182,212,0.1)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]',
    logoText: '⚡ CLICK-CLACK.EXE //',
    logoSub: '// SYSTEM_READY // INTENSITY_MONITOR //',
    keycapClass: 'px-1.5 py-0.5 rounded-sm bg-cyan-950/50 text-cyan-400 border border-cyan-500/40 font-mono text-xs shadow-[0_0_5px_rgba(6,182,212,0.15)]',
    hintSeparator: '◆',
    fontClassOverride: 'font-mono uppercase',
    panelContainerClass: 'bg-slate-950 border-l-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]',
    panelHeaderClass: 'font-black tracking-widest text-xs text-cyan-400 uppercase italic',
    dividerClass: 'border-cyan-950/80',
    buttonClass: (isActive) =>
      `rounded-none border transition-all duration-200 uppercase tracking-wider text-[10px] ${
        isActive
          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-bold'
          : 'border-slate-800 text-slate-500 hover:border-cyan-800 hover:text-cyan-400 hover:bg-slate-900/60'
      }`,
    cardBgClass: 'bg-slate-900/60 border border-cyan-500/35 rounded-none',
  },
  retro: {
    key: 'retro',
    decorateHeader: (t) => `[ ${t.toUpperCase()} ]`,
    editorCardClass: 'border-4 border-double border-yellow-500/80 bg-zinc-900/95 rounded-none shadow-[6px_6px_0px_rgba(245,158,11,0.7)]',
    logoText: '★ INSERT COIN ★ CLICK-CLACK',
    logoSub: '1UP PLAY FOR FREE 🎮',
    keycapClass: 'px-1.5 py-0.5 rounded-none bg-yellow-950/80 text-yellow-500 border-2 border-yellow-600 font-mono text-xs font-black',
    hintSeparator: '■',
    fontClassOverride: 'font-mono uppercase',
    panelContainerClass: 'bg-zinc-900 border-l-4 border-yellow-600 font-mono shadow-[0_0_20px_rgba(0,0,0,0.5)]',
    panelHeaderClass: 'font-black tracking-widest text-xs text-yellow-500 uppercase text-center border-b-2 border-yellow-600 pb-2',
    dividerClass: 'border-yellow-900/60 border-dashed border-t-2',
    buttonClass: (isActive) =>
      `rounded-none border-2 border-zinc-700 transition-all font-mono text-[9px] font-bold ${
        isActive
          ? 'border-yellow-500 bg-yellow-950 text-yellow-400 translate-x-[1px] translate-y-[1px] shadow-none'
          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-700 active:translate-x-[1px] active:translate-y-[1px]'
      }`,
    cardBgClass: 'bg-zinc-950 border-2 border-yellow-600/40 rounded-none shadow-[3px_3px_0px_rgba(217,119,6,0.3)]',
  },
  glass: {
    key: 'glass',
    decorateHeader: (t) => t,
    editorCardClass: 'border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]',
    logoText: 'click-clack',
    logoSub: 'translucent sound experience',
    keycapClass: 'px-1.5 py-0.5 rounded-lg bg-white/10 text-white/95 border border-white/10 backdrop-blur-md font-sans text-xs',
    hintSeparator: '•',
    panelContainerClass: 'bg-white/5 backdrop-blur-2xl border-l border-white/10 text-white/90 shadow-2xl',
    panelHeaderClass: 'font-semibold tracking-wider text-sm text-white/95 font-sans',
    dividerClass: 'border-white/10',
    buttonClass: (isActive) =>
      `rounded-xl border transition-all duration-300 backdrop-blur-md text-[11px] ${
        isActive
          ? 'border-white/35 bg-white/20 text-white font-semibold shadow-[0_4px_12px_rgba(255,255,255,0.06)]'
          : 'border-white/5 bg-white/5 text-white/60 hover:border-white/15 hover:bg-white/10 hover:text-white'
      }`,
    cardBgClass: 'bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-sm',
  },
}
