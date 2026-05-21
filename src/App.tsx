import { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from './store/settings'
import { themes, applyThemeVars, type ThemeName } from './themes'
import { BgCanvas } from './components/BgCanvas'
import { FxCanvas, type FxCanvasHandle } from './components/FxCanvas'
import { Editor, type EditorHandle } from './components/Editor'
import { SettingsPanel } from './components/SettingsPanel'
import { CustomCursor } from './components/CustomCursor'
import { HintText } from './components/ui/HintText'
import { CharCounter } from './components/ui/CharCounter'
import { ToggleButton } from './components/ui/ToggleButton'

function App() {
  const fxRef = useRef<FxCanvasHandle | null>(null)
  const editorRef = useRef<EditorHandle | null>(null)
  
  const [charCount, setCharCount] = useState(0)
  const [editorFocused, setEditorFocused] = useState(true)

  // Subscriptions to settings store
  const themeName = useSettingsStore((state) => state.theme)
  const panelOpen = useSettingsStore((state) => state.panelOpen)
  const togglePanel = useSettingsStore((state) => state.togglePanel)
  const closePanel = useSettingsStore((state) => state.closePanel)
  const setTheme = useSettingsStore((state) => state.setTheme)

  const activeTheme = themes[themeName]

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
      // Escape -> close settings panel
      if (e.key === 'Escape') {
        closePanel()
      }

      // Ctrl + , -> toggle settings panel
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault()
        togglePanel()
      }

      // Ctrl + Backspace -> clear editor content
      if ((e.ctrlKey || e.metaKey) && e.key === 'Backspace') {
        e.preventDefault()
        editorRef.current?.clear()
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
  }, [themeName, togglePanel, closePanel, setTheme])

  return (
    <div
      style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
      className="w-screen h-screen overflow-hidden relative select-none"
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

      {/* Editor Center Container */}
      <main className="fixed inset-0 flex items-center justify-center p-8 z-10">
        <Editor
          ref={editorRef}
          onKeystroke={handleKeystroke}
          onCharCount={setCharCount}
          onFocus={() => setEditorFocused(true)}
          onBlur={() => setEditorFocused(false)}
        />
      </main>

      {/* Hint UI overlay */}
      <HintText faded={charCount > 0} />

      {/* Statistics char count indicator */}
      <CharCounter count={charCount} hidden={panelOpen} />

      {/* Float setting buttons */}
      <ToggleButton onClick={togglePanel} />

      {/* Settings slide-out drawer panel */}
      <SettingsPanel />

      {/* Custom follower mouse cursor (focused ring shrinks) */}
      <CustomCursor focused={editorFocused} />
    </div>
  )
}

export default App
