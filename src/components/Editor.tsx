import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { useSettingsStore } from '../store/settings'
import { getCaretCoords } from '../hooks/useCaretPos'
import { themes, pickAccent } from '../themes'

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
      <div className="relative w-full max-w-4xl px-4 py-8">
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
            outline-hidden min-h-[30vh] max-h-[70vh] w-full text-center text-3xl md:text-4xl 
            font-medium leading-relaxed tracking-wide overflow-y-auto whitespace-pre-wrap
            break-words transition-all duration-300 z-10 select-text
            ${fontClasses[font] || 'font-dm-sans'}
          `}
          style={{
            // Custom styles for placeholders and selections
            caretColor: 'var(--accent)',
          }}
        />
        
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
