import { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from './store/settings'
import { themes, applyThemeVars, type ThemeName } from './themes'
import { BgCanvas } from './components/BgCanvas'
import { FxCanvas, type FxCanvasHandle } from './components/FxCanvas'
import { Editor, type EditorHandle } from './components/Editor'
import { TypingTest, type TypingTestHandle } from './components/TypingTest'
import { SettingsPanel } from './components/SettingsPanel'
import { CustomCursor } from './components/CustomCursor'
import { HintText } from './components/ui/HintText'
import { CharCounter } from './components/ui/CharCounter'
import { ToggleButton } from './components/ui/ToggleButton'
import { StreakPanel } from './components/ui/StreakPanel'
import { LogoHeader } from './components/ui/LogoHeader'
import { uiPresets } from './utils/stylePresets'
import { UiPanel } from './components/UiPanel'
import { Palette } from 'lucide-react'

const getUiAccentColor = (style: string, themeKey: ThemeName) => {
  switch (style) {
    case 'cute':
      return '#f472b6' // pink-400
    case 'hacker':
      return '#10b981' // emerald-500
    case 'cyber':
      return '#06b6d4' // cyan-500
    case 'retro':
      return '#f59e0b' // yellow-500
    case 'glass':
      return '#ffffff' // white
    case 'classic':
    default:
      return themes[themeKey]?.accents[0] || '#00ff9d'
  }
}

function App() {
  const fxRef = useRef<FxCanvasHandle | null>(null)
  const editorRef = useRef<EditorHandle | null>(null)
  const typingTestRef = useRef<TypingTestHandle | null>(null)
  
  const [charCount, setCharCount] = useState(0)
  const [editorFocused, setEditorFocused] = useState(true)

  // Subscriptions to settings store
  const themeName = useSettingsStore((state) => state.theme)
  const uiStyle = useSettingsStore((state) => state.uiStyle)
  const panelOpen = useSettingsStore((state) => state.panelOpen)
  const togglePanel = useSettingsStore((state) => state.togglePanel)
  const closePanel = useSettingsStore((state) => state.closePanel)
  const uiPanelOpen = useSettingsStore((state) => state.uiPanelOpen)
  const toggleUiPanel = useSettingsStore((state) => state.toggleUiPanel)
  const closeUiPanel = useSettingsStore((state) => state.closeUiPanel)
  const showWatermark = useSettingsStore((state) => state.showWatermark)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const typingMode = useSettingsStore((state) => state.typingMode)

  const activeTheme = themes[themeName]
  const preset = uiPresets[uiStyle]

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    applyThemeVars(activeTheme)
  }, [themeName, activeTheme])

  // Key Event triggers for keystroke effects
  const handleKeystroke = (x: number, y: number, key: string) => {
    fxRef.current?.spawn(x, y, key)
  }

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape -> close settings panels
      if (e.key === 'Escape') {
        closePanel()
        closeUiPanel()
      }

      // Ctrl + , -> toggle settings panel
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault()
        togglePanel()
      }

      // Ctrl + Backspace -> clear/restart typing area
      if ((e.ctrlKey || e.metaKey) && e.key === 'Backspace') {
        e.preventDefault()
        if (typingMode === 'sandbox') {
          editorRef.current?.clear()
        } else {
          typingTestRef.current?.reset()
        }
      }

      // Ctrl + Shift + R -> cycle/randomize theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault()
        const themeKeys = Object.keys(themes) as ThemeName[]
        const currentIdx = themeKeys.indexOf(themeName)
        
        let nextIdx = Math.floor(Math.random() * themeKeys.length)
        while (nextIdx === currentIdx && themeKeys.length > 1) {
          nextIdx = Math.floor(Math.random() * themeKeys.length)
        }
        
        setTheme(themeKeys[nextIdx])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [themeName, togglePanel, closePanel, closeUiPanel, setTheme, typingMode])

  const uiAccentColor = getUiAccentColor(uiStyle, themeName)

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        '--ui-accent': uiAccentColor,
      } as React.CSSProperties}
      className={`w-screen h-screen overflow-hidden relative select-none ${preset.fontClassOverride || ''}`}
    >
      {/* Scanline CRT overlay for retro-style dark themes */}
      {activeTheme.scanlines && (
        <div
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
          }}
        />
      )}

      {/* Background ambient floating particles */}
      <BgCanvas />

      {/* Main effect interaction particles */}
      <FxCanvas ref={fxRef} />

      {/* Top Left Dynamic Logo */}
      {showWatermark && (
        <div className="fixed top-6 left-6 z-30 select-none hidden md:block">
          <LogoHeader />
        </div>
      )}

      {/* Top Center Mode Selector Selector Tab */}
      <header className="fixed top-6 left-0 right-0 flex justify-center z-30 select-none">
        <div className={`flex p-1 shadow-lg transition-all duration-300 ${
          uiStyle === 'classic' ? 'bg-[var(--bg2)]/60 border border-[var(--border)] rounded-full backdrop-blur-md' :
          uiStyle === 'cute' ? 'bg-pink-100/10 border-2 border-pink-300/40 rounded-[2rem] backdrop-blur-md' :
          uiStyle === 'hacker' ? 'bg-black border border-emerald-500/50 rounded-none shadow-[0_0_10px_rgba(16,185,129,0.15)]' :
          uiStyle === 'cyber' ? 'bg-slate-950/80 border border-cyan-500/50 rounded-none' :
          uiStyle === 'retro' ? 'bg-zinc-950 border-4 border-yellow-600 rounded-none shadow-[3px_3px_0px_#d97706]' :
          'bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl'
        }`}>
          <button
            onClick={() => useSettingsStore.getState().setTypingMode('sandbox')}
            className={`px-5 py-1.5 transition-all duration-300 cursor-pointer ${
              uiStyle === 'classic' ? 'rounded-full text-xs font-bold' :
              uiStyle === 'cute' ? 'rounded-full text-xs font-black' :
              uiStyle === 'hacker' ? 'rounded-none text-xs font-mono' :
              uiStyle === 'cyber' ? 'rounded-none text-xs font-mono tracking-wider' :
              uiStyle === 'retro' ? 'rounded-none text-xs font-mono font-black' :
              'rounded-xl text-xs font-medium'
            } ${
              typingMode === 'sandbox'
                ? uiStyle === 'classic' ? 'bg-[var(--accent)] text-[var(--bg)] shadow-md' :
                  uiStyle === 'cute' ? 'bg-pink-400 text-white shadow-md' :
                  uiStyle === 'hacker' ? 'bg-emerald-500 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  uiStyle === 'cyber' ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' :
                  uiStyle === 'retro' ? 'bg-yellow-500 text-black font-black' :
                  'bg-white/20 text-white shadow-sm'
                : 'text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)]/30'
            }`}
          >
            Sandbox Play
          </button>
          <button
            onClick={() => useSettingsStore.getState().setTypingMode('test')}
            className={`px-5 py-1.5 transition-all duration-300 cursor-pointer ${
              uiStyle === 'classic' ? 'rounded-full text-xs font-bold' :
              uiStyle === 'cute' ? 'rounded-full text-xs font-black' :
              uiStyle === 'hacker' ? 'rounded-none text-xs font-mono' :
              uiStyle === 'cyber' ? 'rounded-none text-xs font-mono tracking-wider' :
              uiStyle === 'retro' ? 'rounded-none text-xs font-mono font-black' :
              'rounded-xl text-xs font-medium'
            } ${
              typingMode === 'test'
                ? uiStyle === 'classic' ? 'bg-[var(--accent)] text-[var(--bg)] shadow-md' :
                  uiStyle === 'cute' ? 'bg-pink-400 text-white shadow-md' :
                  uiStyle === 'hacker' ? 'bg-emerald-500 text-black font-bold shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  uiStyle === 'cyber' ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' :
                  uiStyle === 'retro' ? 'bg-yellow-500 text-black font-black' :
                  'bg-white/20 text-white shadow-sm'
                : 'text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)]/30'
            }`}
          >
            10FastFingers Mode
          </button>
        </div>
      </header>

      {/* Editor Center Container */}
      <main className="fixed inset-0 flex items-center justify-center p-8 z-10">
        {typingMode === 'sandbox' ? (
          <Editor
            ref={editorRef}
            onKeystroke={handleKeystroke}
            onCharCount={setCharCount}
            onFocus={() => setEditorFocused(true)}
            onBlur={() => setEditorFocused(false)}
          />
        ) : (
          <TypingTest
            ref={typingTestRef}
            onKeystroke={handleKeystroke}
            onFocus={() => setEditorFocused(true)}
            onBlur={() => setEditorFocused(false)}
          />
        )}
      </main>

      {/* Hint UI overlay */}
      {typingMode === 'sandbox' && <HintText faded={charCount > 0} />}

      {/* Statistics char count indicator */}
      {typingMode === 'sandbox' && <CharCounter count={charCount} hidden={panelOpen || uiPanelOpen} />}

      {/* Real-time typing speed and combo streak */}
      {typingMode === 'sandbox' && <StreakPanel hidden={panelOpen || uiPanelOpen} />}

      {/* Float Customizer and Settings Buttons */}
      <div className="flex gap-2">
        <button
          onClick={toggleUiPanel}
          className="fixed top-6 right-[70px] p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] hover:scale-105 active:scale-95 transition-all duration-200 z-30 cursor-pointer shadow-xs"
          style={{
            backgroundColor: 'var(--bg2)',
            color: 'var(--fg)',
          }}
          title="Toggle UI Customizer"
        >
          <Palette size={16} />
        </button>
        <ToggleButton onClick={togglePanel} />
      </div>

      {/* Settings slide-out drawer panel */}
      <SettingsPanel />

      {/* UI Customizer slide-out drawer panel */}
      <UiPanel />

      {/* Custom follower mouse cursor (focused ring shrinks) */}
      <CustomCursor focused={editorFocused} />
    </div>
  )
}

export default App
