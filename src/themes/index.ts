export type ThemeName = 'cyber' | 'lofi' | 'minimal' | 'vivid' | 'ocean' | 'sakura' | 'synthwave' | 'dracula' | 'nord'

export interface Theme {
  name: string
  bg: string
  bg2: string
  fg: string
  muted: string
  border: string
  accents: string[]       // used by effects
  isLight: boolean        // affects panel text contrast
  fireColors: string[]    // fire effect palette per theme
  scanlines: boolean      // dark themes get scanline overlay
}

export const themes: Record<ThemeName, Theme> = {
  cyber: {
    name: 'Cyber',
    bg: '#0a0a0f',
    bg2: '#12121c',
    fg: '#e2e2f0',
    muted: 'rgba(226,226,240,0.2)',
    border: 'rgba(226,226,240,0.1)',
    accents: ['#00ff9d', '#ff00cc', '#00ccff'],
    isLight: false,
    scanlines: true,
    fireColors: ['#ff4400', '#ff8800', '#ffcc00'],
  },
  lofi: {
    name: 'Lofi',
    bg: '#fdf6ec',
    bg2: '#f5ece0',
    fg: '#5a3a2a',
    muted: 'rgba(90,58,42,0.25)',
    border: 'rgba(90,58,42,0.1)',
    accents: ['#e07090', '#70a8c8', '#a0c890'],
    isLight: true,
    scanlines: false,
    fireColors: ['#ffcda8', '#ff9d70', '#ff7060'],
  },
  minimal: {
    name: 'Minimal',
    bg: '#f8f8f8',
    bg2: '#eeeeee',
    fg: '#1a1a1a',
    muted: 'rgba(26,26,26,0.3)',
    border: 'rgba(26,26,26,0.1)',
    accents: ['#1a1a1a', '#555555', '#999999'],
    isLight: true,
    scanlines: false,
    fireColors: ['#333333', '#666666', '#aaaaaa'],
  },
  vivid: {
    name: 'Vivid',
    bg: '#0f0f1a',
    bg2: '#1a1a2e',
    fg: '#ffffff',
    muted: 'rgba(255,255,255,0.2)',
    border: 'rgba(255,255,255,0.1)',
    accents: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8'],
    isLight: false,
    scanlines: false,
    fireColors: ['#ff4400', '#ff8800', '#ffcc00'],
  },
  ocean: {
    name: 'Ocean',
    bg: '#020c1b',
    bg2: '#071428',
    fg: '#64ffda',
    muted: 'rgba(100,255,218,0.2)',
    border: 'rgba(100,255,218,0.1)',
    accents: ['#00b4ff', '#64ffda', '#0066cc'],
    isLight: false,
    scanlines: true,
    fireColors: ['#00ffcc', '#00aaff', '#0044ff'],
  },
  sakura: {
    name: 'Sakura',
    bg: '#fff8f9',
    bg2: '#ffeff3',
    fg: '#3a1828',
    muted: 'rgba(58,24,40,0.25)',
    border: 'rgba(58,24,40,0.1)',
    accents: ['#e8709a', '#c4a0c8', '#f0c0d0'],
    isLight: true,
    scanlines: false,
    fireColors: ['#ffd6e0', '#ffaac0', '#ff80a0'],
  },
  synthwave: {
    name: 'Synthwave',
    bg: '#140526',
    bg2: '#230b3b',
    fg: '#ff007f',
    muted: 'rgba(255,0,127,0.2)',
    border: 'rgba(255,0,127,0.1)',
    accents: ['#ff007f', '#00ffff', '#ffaa00'],
    isLight: false,
    scanlines: true,
    fireColors: ['#ff007f', '#9b5de5', '#00f5d4'],
  },
  dracula: {
    name: 'Dracula',
    bg: '#282a36',
    bg2: '#1e1f29',
    fg: '#f8f8f2',
    muted: 'rgba(248,248,242,0.2)',
    border: 'rgba(248,248,242,0.1)',
    accents: ['#bd93f9', '#ff79c6', '#50fa7b'],
    isLight: false,
    scanlines: false,
    fireColors: ['#ff5555', '#ffb86c', '#f1fa8c'],
  },
  nord: {
    name: 'Nord',
    bg: '#2e3440',
    bg2: '#242933',
    fg: '#d8dee9',
    muted: 'rgba(216,222,233,0.25)',
    border: 'rgba(216,222,233,0.1)',
    accents: ['#88c0d0', '#8fbcbb', '#a3be8c'],
    isLight: false,
    scanlines: false,
    fireColors: ['#88c0d0', '#81a1c1', '#5e81ac'],
  },
}

let hueOffset = 0

export function pickAccent(theme: Theme): string {
  if (theme.name === 'Vivid') {
    hueOffset = (hueOffset + 28) % 360
    return `hsl(${hueOffset}, 80%, 65%)`
  }
  return theme.accents[Math.floor(Math.random() * theme.accents.length)]
}

export function applyThemeVars(theme: Theme) {
  const r = document.documentElement.style
  r.setProperty('--bg', theme.bg)
  r.setProperty('--bg2', theme.bg2)
  r.setProperty('--fg', theme.fg)
  r.setProperty('--accent', theme.accents[0])
  r.setProperty('--muted', theme.muted)
  r.setProperty('--border', theme.border)
}
