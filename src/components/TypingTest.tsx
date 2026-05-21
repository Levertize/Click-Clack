import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { useSettingsStore } from '../store/settings'
import { uiPresets } from '../utils/stylePresets'
import { generateWordList } from '../utils/words'
import { keyboardSynth } from '../utils/audio'
import { getCaretCoords } from '../hooks/useCaretPos'
import { motion, AnimatePresence } from 'framer-motion'

interface TypingTestProps {
  onKeystroke: (x: number, y: number, key: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface TypingTestHandle {
  focus: () => void
  reset: () => void
}

export const TypingTest = forwardRef<TypingTestHandle, TypingTestProps>(
  ({ onKeystroke, onFocus, onBlur }, ref) => {
    const font = useSettingsStore((state) => state.font)
    const typingLanguage = useSettingsStore((state) => state.typingLanguage)
    const testDuration = useSettingsStore((state) => state.testDuration)
    const uiStyle = useSettingsStore((state) => state.uiStyle)
    const preset = uiPresets[uiStyle]

    // Refs
    const inputRef = useRef<HTMLDivElement | null>(null)
    const wordsContainerRef = useRef<HTMLDivElement | null>(null)
    const activeWordRef = useRef<HTMLSpanElement | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // State variables
    const [shakeTransform, setShakeTransform] = useState('translate3d(0, 0, 0)')
    const [words, setWords] = useState<string[]>([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [typedWordsHistory, setTypedWordsHistory] = useState<string[]>([])
    const [currentTyped, setCurrentTyped] = useState('')
    
    // Stats tracking
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
    const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0)
    const [correctWordsCount, setCorrectWordsCount] = useState(0)
    const [incorrectWordsCount, setIncorrectWordsCount] = useState(0)

    // Timer & Flow state
    const [timeLeft, setTimeLeft] = useState(testDuration)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus()
      },
      reset() {
        handleReset()
      },
    }))

    // Generate initial word list
    useEffect(() => {
      setWords(generateWordList(typingLanguage, 120))
    }, [typingLanguage])

    // Update timer default limit when setting changes
    useEffect(() => {
      setTimeLeft(testDuration)
      handleReset()
    }, [testDuration, typingLanguage])

    // Scroll active word into view smoothly
    useEffect(() => {
      if (activeWordRef.current && wordsContainerRef.current) {
        const container = wordsContainerRef.current
        const activeWord = activeWordRef.current
        
        // Calculate offset position relative to the container
        const activeTop = activeWord.offsetTop
        const activeHeight = activeWord.offsetHeight
        const containerHeight = container.clientHeight
        
        // Scroll to keep the active word centered in the container
        container.scrollTo({
          top: activeTop - containerHeight / 2 + activeHeight / 2,
          behavior: 'smooth'
        })
      }
    }, [currentWordIndex])

    // Timer countdown implementation
    useEffect(() => {
      if (isTimerRunning && timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsTimerRunning(false)
              setIsFinished(true)
              if (timerRef.current) clearInterval(timerRef.current)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, [isTimerRunning, timeLeft])

    const startTimer = () => {
      if (!isTimerRunning && !isFinished) {
        setIsTimerRunning(true)
      }
    }

    const handleReset = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      setWords(generateWordList(typingLanguage, 120))
      setCurrentWordIndex(0)
      setTypedWordsHistory([])
      setCurrentTyped('')
      setCorrectKeystrokes(0)
      setIncorrectKeystrokes(0)
      setCorrectWordsCount(0)
      setIncorrectWordsCount(0)
      setTimeLeft(testDuration)
      setIsTimerRunning(false)
      setIsFinished(false)

      if (inputRef.current) {
        inputRef.current.innerHTML = ''
      }
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFinished) {
        e.preventDefault()
        return
      }

      const { key } = e

      // Ignore standard helper/modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'Tab'].includes(key)) {
        return
      }

      // Start timer on first keystroke
      if (!isTimerRunning && !isFinished) {
        startTimer()
      }

      const settings = useSettingsStore.getState()

      // Play switch clicking sounds
      keyboardSynth.setVolume(settings.soundVolume / 10)
      keyboardSynth.setPitch(settings.soundPitch / 5)
      keyboardSynth.playClick(settings.soundEffect, key)

      // Apply tactile screen shake
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

      // Visual effects spawning on caret position
      const fallbackX = window.innerWidth / 2
      const fallbackY = window.innerHeight / 2
      const coords = getCaretCoords({ x: fallbackX, y: fallbackY })
      onKeystroke(coords.x, coords.y, key)

      // Handle space bar word commits
      if (key === ' ') {
        e.preventDefault()
        const typedWord = (inputRef.current?.textContent || '').replace(/\u200B/g, '').trim()
        
        // Prevent empty submissions
        if (typedWord === '') return

        const targetWord = words[currentWordIndex]
        const isWordCorrect = typedWord === targetWord

        // Word score additions
        if (isWordCorrect) {
          setCorrectWordsCount((prev) => prev + 1)
          // Add length of word + 1 space to correct keystrokes
          setCorrectKeystrokes((prev) => prev + targetWord.length + 1)
        } else {
          setIncorrectWordsCount((prev) => prev + 1)
          setIncorrectKeystrokes((prev) => prev + typedWord.length + 1)
        }

        setTypedWordsHistory((prev) => [...prev, typedWord])
        setCurrentWordIndex((prev) => prev + 1)
        setCurrentTyped('')
        
        if (inputRef.current) {
          inputRef.current.innerHTML = ''
        }

        // Generate more words if nearing end of pre-generated list
        if (currentWordIndex >= words.length - 10) {
          setWords((prev) => [...prev, ...generateWordList(typingLanguage, 50)])
        }
      } else if (key === 'Enter') {
        // Prevent newline wraps
        e.preventDefault()
      }
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const typed = (e.currentTarget.textContent || '').replace(/\u200B/g, '')
      setCurrentTyped(typed)

      // Realtime key-by-key keystroke tracking for accuracy
      const lastChar = typed[typed.length - 1]
      const targetWord = words[currentWordIndex]
      
      if (lastChar && targetWord) {
        const checkIndex = typed.length - 1
        if (lastChar === targetWord[checkIndex]) {
          setCorrectKeystrokes((prev) => prev + 1)
        } else {
          setIncorrectKeystrokes((prev) => prev + 1)
        }
      }
    }

    // WPM and Accuracy metrics calculations
    const timeElapsed = testDuration - timeLeft
    const timeElapsedMin = timeElapsed > 0 ? timeElapsed / 60 : 0.001
    
    // WPM = (correct characters / 5) / (minutes elapsed)
    const rawWpm = timeElapsedMin > 0 ? Math.round((correctKeystrokes / 5) / timeElapsedMin) : 0
    const wpm = Math.max(0, rawWpm)

    const totalKeyStrokes = correctKeystrokes + incorrectKeystrokes
    const accuracy = totalKeyStrokes > 0 ? Math.round((correctKeystrokes / totalKeyStrokes) * 1000) / 10 : 100

    const fontClasses = {
      spaceMono: 'font-space-mono',
      syneMono: 'font-syne-mono',
      playfair: 'font-playfair',
      dmSans: 'font-dm-sans',
    }

    const renderCardHeader = () => {
      switch (uiStyle) {
        case 'hacker':
          return (
            <div className="flex items-center justify-between bg-black/60 border-b border-emerald-500/40 px-4 py-2 font-mono text-[10px] text-emerald-400 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-bold">click_clack.sh — bash</span>
              <span className="opacity-40">UTF-8</span>
            </div>
          )
        case 'cute':
          return (
            <div className="flex items-center justify-between px-6 py-2.5 text-pink-400 font-sans text-xs font-extrabold border-b border-pink-200/35 dark:border-pink-900/30 bg-pink-100/10 select-none">
              <span>✿ (◕‿◕✿) ✿</span>
              <span className="tracking-wide">✿ happy typing area ✿</span>
              <span>✿ (◕‿◕✿) ✿</span>
            </div>
          )
        case 'cyber':
          return (
            <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 font-mono text-[9px] text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
                <span className="font-bold">ONLINE</span>
              </div>
              <span className="font-semibold text-cyan-400/80">CC_SYS_v4.0.0</span>
              <span>[SECURE]</span>
            </div>
          )
        case 'retro':
          return (
            <div className="flex items-center justify-between bg-zinc-950 px-4 py-2 font-mono text-xs text-yellow-500 uppercase tracking-widest border-b-4 border-double border-yellow-600/40 select-none">
              <span>◆ 1UP ◆</span>
              <span className="font-black">INSERT COIN</span>
              <span>◆ PLAY ◆</span>
            </div>
          )
        case 'glass':
          return (
            <div className="flex items-center justify-between px-6 py-2.5 text-white/35 font-sans text-xs tracking-wider border-b border-white/5 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <span className="font-medium">click-clack editor</span>
              <span className="w-4" />
            </div>
          )
        default:
          return null
      }
    }

    return (
      <div 
        className={`relative w-full max-w-3xl px-4 py-8 transition-transform duration-75 ${preset.fontClassOverride || ''} ${fontClasses[font] || 'font-dm-sans'}`}
        style={{ transform: shakeTransform }}
      >
        <div className={`overflow-hidden transition-all duration-300 ${preset.editorCardClass}`}>
          {renderCardHeader()}
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {!isFinished ? (
                <motion.div
                  key="typing-area"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Header Info Panel */}
                  <div className={`flex justify-between items-center px-5 py-3 select-none ${preset.cardBgClass}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-xs uppercase tracking-wider opacity-60 font-semibold">
                        Language: <span className="text-[var(--accent)] font-bold uppercase">{typingLanguage}</span>
                      </span>
                      <span className="text-xs uppercase tracking-wider opacity-60 font-semibold">
                        Time: <span className="text-[var(--accent)] font-bold">{timeLeft}s</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold opacity-70">
                        Live WPM: <span className="text-[var(--accent)] font-bold">{wpm}</span>
                      </span>
                      <span className="font-mono text-sm font-semibold opacity-70">
                        Acc: <span className="text-[var(--accent)] font-bold">{accuracy}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Words Container */}
                  <div 
                    ref={wordsContainerRef}
                    className={`flex flex-wrap gap-x-4 gap-y-3 p-6 text-xl md:text-2xl h-[130px] overflow-hidden relative select-none backdrop-blur-md transition-all leading-normal ${preset.cardBgClass}`}
                  >
                    {words.map((word, idx) => {
                      let isCurrent = idx === currentWordIndex
                      let isTyped = idx < currentWordIndex
                      let wasCorrect = isTyped && typedWordsHistory[idx] === word
                      
                      let wordColor = 'text-[var(--fg)] opacity-70'
                      let underline = ''
                      let bgHighlight = ''

                      if (isCurrent) {
                        underline = 'underline decoration-2 underline-offset-4 decoration-[var(--accent)]'
                        wordColor = 'text-[var(--accent)] font-bold glow-sm scale-[1.02] inline-block'
                        bgHighlight = 'bg-[var(--muted)]/50 rounded-sm px-1.5 py-0.5'
                      } else if (isTyped) {
                        if (wasCorrect) {
                          wordColor = 'text-[#00ff9d] opacity-90'
                        } else {
                          wordColor = 'text-[#ff4444] opacity-90 line-through'
                        }
                      } else {
                        wordColor = 'text-[var(--fg)] opacity-35'
                      }

                      // Determine sub-word char styling if they have mistyped the prefix
                      let characters = word.split('')
                      let currentTypedWordLength = currentTyped.length

                      return (
                        <span
                          key={idx}
                          ref={isCurrent ? activeWordRef : null}
                          className={`transition-all duration-150 shrink-0 ${wordColor} ${underline} ${bgHighlight}`}
                        >
                          {isCurrent && currentTypedWordLength > 0 ? (
                            characters.map((char, charIdx) => {
                              let charTyped = currentTyped[charIdx]
                              let charColor = ''
                              if (charTyped === undefined) {
                                charColor = 'text-[var(--accent)] font-bold'
                              } else if (charTyped === char) {
                                charColor = 'text-[var(--accent)] opacity-100 font-bold'
                              } else {
                                charColor = 'text-[#ff4444] font-bold underline decoration-[#ff4444]'
                              }
                              return (
                                <span key={charIdx} className={charColor}>
                                  {char}
                                </span>
                              )
                            })
                          ) : (
                            word
                          )}
                          {isCurrent && currentTypedWordLength > characters.length && (
                            <span className="text-[#ff4444] font-bold">
                              {currentTyped.substring(characters.length)}
                            </span>
                          )}
                        </span>
                      )
                    })}
                  </div>

                  {/* Typing Input */}
                  <div className="flex gap-4">
                    <div
                      ref={inputRef}
                      contentEditable
                      spellCheck={false}
                      onKeyDown={handleKeyDown}
                      onInput={handleInput}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      data-placeholder="Start typing the text here..."
                      className={`flex-1 outline-hidden text-2xl md:text-3xl text-center py-4 px-6 focus:border-[var(--accent)] transition-all min-h-[64px] overflow-hidden select-text shadow-inner ${preset.cardBgClass}`}
                      style={{ caretColor: 'var(--accent)' }}
                    />
                    <button 
                      onClick={handleReset} 
                      title="Restart test"
                      className={`p-4 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center shrink-0 ${preset.buttonClass(false)}`}
                    >
                      <RotateCcw size={22} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Results Dashboard Screen
                <motion.div
                  key="results-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 select-none"
                >
                  <div className="text-center">
                    <h2 className={`text-3xl font-black uppercase tracking-wider text-[var(--accent)] ${uiStyle === 'cute' ? 'text-pink-500 dark:text-pink-400' : ''}`}>
                      {preset.decorateHeader('Test Results')}
                    </h2>
                    <p className="text-sm opacity-60 mt-1">Typing Speed & Accuracy Metrics</p>
                  </div>

                  {/* Grid cards of results stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {/* WPM */}
                    <div className={`flex flex-col items-center p-4 ${preset.cardBgClass}`}>
                      <span className="text-[10px] uppercase opacity-55 font-bold tracking-wider">Speed</span>
                      <span className="text-4xl font-extrabold text-[var(--accent)] mt-1">{wpm}</span>
                      <span className="text-[10px] font-semibold opacity-60 mt-0.5">WPM</span>
                    </div>

                    {/* Accuracy */}
                    <div className={`flex flex-col items-center p-4 ${preset.cardBgClass}`}>
                      <span className="text-[10px] uppercase opacity-55 font-bold tracking-wider">Accuracy</span>
                      <span className="text-4xl font-extrabold text-[var(--accent)] mt-1">{accuracy}%</span>
                      <span className="text-[10px] font-semibold opacity-60 mt-0.5">Correct keys</span>
                    </div>

                    {/* Keystrokes */}
                    <div className={`flex flex-col items-center p-4 ${preset.cardBgClass}`}>
                      <span className="text-[10px] uppercase opacity-55 font-bold tracking-wider">Keystrokes</span>
                      <div className="text-xl font-bold mt-2">
                        <span className="text-[#00ff9d]">{correctKeystrokes}</span>
                        <span className="opacity-40"> / </span>
                        <span className="text-[#ff4444]">{incorrectKeystrokes}</span>
                      </div>
                      <span className="text-[9px] font-semibold opacity-50 mt-1">correct / wrong</span>
                    </div>

                    {/* Words count */}
                    <div className={`flex flex-col items-center p-4 ${preset.cardBgClass}`}>
                      <span className="text-[10px] uppercase opacity-55 font-bold tracking-wider">Words Typed</span>
                      <div className="text-xl font-bold mt-2">
                        <span className="text-[#00ff9d]">{correctWordsCount}</span>
                        <span className="opacity-40"> / </span>
                        <span className="text-[#ff4444]">{incorrectWordsCount}</span>
                      </div>
                      <span className="text-[9px] font-semibold opacity-50 mt-1">correct / wrong</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleReset}
                      className={`px-8 py-3 font-bold transition-all duration-200 outline-hidden cursor-pointer flex items-center gap-2 text-md hover:scale-[1.03] active:scale-[0.97] ${preset.buttonClass(true)}`}
                    >
                      <RotateCcw size={18} />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Style block for placeholder in typing-test contenteditable */}
        <style>{`
          [contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: var(--muted);
            opacity: 0.6;
            pointer-events: none;
            display: block;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
)

TypingTest.displayName = 'TypingTest'
