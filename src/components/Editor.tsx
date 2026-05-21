import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react'
import { useSettingsStore } from '../store/settings'
import { uiPresets } from '../utils/stylePresets'
import { getCaretCoords } from '../hooks/useCaretPos'
import { themes, pickAccent } from '../themes'
import { keyboardSynth } from '../utils/audio'

interface EditorProps {
  onKeystroke: (x: number, y: number, key: string) => void
  onCharCount: (count: number) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface EditorHandle {
  focus: () => void
  clear: () => void
}

export const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ onKeystroke, onCharCount, onFocus, onBlur }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const font = useSettingsStore((state) => state.font)
    const uiStyle = useSettingsStore((state) => state.uiStyle)
    const preset = uiPresets[uiStyle]
    const [shakeTransform, setShakeTransform] = useState('translate3d(0, 0, 0)')

    useImperativeHandle(ref, () => ({
      focus() {
        editorRef.current?.focus()
      },
      clear() {
        if (editorRef.current) {
          editorRef.current.innerHTML = ''
          onCharCount(0)
        }
      },
    }))

    // Focus editor on mount
    useEffect(() => {
      editorRef.current?.focus()
    }, [])

    const handleRainbowChars = () => {
      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const textNode = range.startContainer

      // Only wrap if we are typing inside a text node
      if (textNode.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
        const offset = range.startOffset
        const text = textNode.nodeValue || ''
        const char = text[offset - 1]

        // Skip wrapping if it's whitespace
        if (char && char.trim() !== '') {
          const activeTheme = themes[useSettingsStore.getState().theme]
          const color = pickAccent(activeTheme)

          const parent = textNode.parentNode
          if (parent) {
            // Create a span to wrap the single character
            const span = document.createElement('span')
            span.style.color = color
            span.className = 'transition-all duration-300'
            span.textContent = char

            const beforeText = text.substring(0, offset - 1)
            const afterText = text.substring(offset)

            // Truncate original text node to before-content
            textNode.nodeValue = beforeText

            const nextSibling = textNode.nextSibling
            parent.insertBefore(span, nextSibling)

            let cursorTargetNode: Node = span
            if (afterText.length > 0) {
              const afterNode = document.createTextNode(afterText)
              parent.insertBefore(afterNode, nextSibling)
              cursorTargetNode = afterNode
            } else {
              const emptyNode = document.createTextNode('\u200B') // Zero-width space for cursor reference
              parent.insertBefore(emptyNode, nextSibling)
              cursorTargetNode = emptyNode
            }

            // Restore selection position precisely
            const newRange = document.createRange()
            if (cursorTargetNode.nodeType === Node.TEXT_NODE) {
              newRange.setStart(cursorTargetNode, cursorTargetNode.textContent === '\u200B' ? 1 : 0)
              newRange.setEnd(cursorTargetNode, cursorTargetNode.textContent === '\u200B' ? 1 : 0)
            } else {
              newRange.setStartAfter(span)
              newRange.setEndAfter(span)
            }
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e
      
      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'Tab'].includes(key)) {
        return
      }

      // Check if it's a typing key or a triggering special key
      const isPrintable = key.length === 1 || key === 'Enter' || key === 'Backspace'
      if (!isPrintable) return

      // Play procedurally synthesized sounds
      const settings = useSettingsStore.getState()
      keyboardSynth.setVolume(settings.soundVolume / 10)
      keyboardSynth.setPitch(settings.soundPitch / 5) // pitch slider (default 5 matches 1.0)
      keyboardSynth.playClick(settings.soundEffect, key)

      // Handle screen shake
      if (settings.screenShake > 0) {
        let force = settings.screenShake * 1.5
        if (key === 'Enter') force *= 2.0
        else if (key === 'Backspace') force *= 1.3
        else if (key === ' ') force *= 1.6

        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * force
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist

        setShakeTransform(`translate3d(${dx}px, ${dy}px, 0)`)
        setTimeout(() => {
          setShakeTransform('translate3d(0, 0, 0)')
        }, 50)
      }

      // Get caret coordinates
      const fallbackX = window.innerWidth / 2
      const fallbackY = window.innerHeight / 2
      const coords = getCaretCoords({ x: fallbackX, y: fallbackY })

      // Custom center positioning for Enter
      if (key === 'Enter') {
        onKeystroke(fallbackX, fallbackY, key)
      } else {
        onKeystroke(coords.x, coords.y, key)
      }
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      
      // Check if completely empty
      if (target.textContent === '' || target.textContent === '\u200B') {
        target.innerHTML = ''
      }

      const count = target.textContent?.replace(/\u200B/g, '').length || 0
      onCharCount(count)

      // Apply rainbow characters if turned on
      const isRainbow = useSettingsStore.getState().rainbowChars
      if (isRainbow) {
        const inputEvent = e.nativeEvent as InputEvent
        if (inputEvent.inputType && inputEvent.inputType.startsWith('insert')) {
          handleRainbowChars()
        }
      }
    }

    const fontClasses = {
      spaceMono: 'font-space-mono',
      syneMono: 'font-syne-mono',
      playfair: 'font-playfair',
      dmSans: 'font-dm-sans',
    }



    return (
      <div 
        className="relative w-full max-w-4xl px-4 py-8 transition-transform duration-75"
        style={{ transform: shakeTransform }}
      >
        <div className="overflow-hidden transition-all duration-300 bg-transparent border-none shadow-none">
          <div className="p-4 md:p-6">
            <div
              ref={editorRef}
              contentEditable
              spellCheck={false}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              onFocus={onFocus}
              onBlur={onBlur}
              data-placeholder="Start typing to experience the magic..."
              className={`
                outline-hidden min-h-[25vh] max-h-[60vh] w-full text-center text-3xl md:text-4xl 
                font-medium leading-relaxed tracking-wide overflow-y-auto whitespace-pre-wrap
                break-words transition-all duration-300 z-10 select-text
                ${preset.fontClassOverride || ''}
                ${fontClasses[font] || 'font-dm-sans'}
              `}
              style={{
                caretColor: 'var(--accent)',
              }}
            />
          </div>
        </div>
        
        {/* Style block for contenteditable placeholder */}
        <style>{`
          [contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: var(--muted);
            opacity: 0.6;
            pointer-events: none;
            display: block;
            text-align: center;
          }
          [contenteditable="true"]::selection {
            background-color: var(--muted);
          }
        `}</style>
      </div>
    )
  }
)

Editor.displayName = 'Editor'

