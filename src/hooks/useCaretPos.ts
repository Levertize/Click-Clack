export function getCaretCoords(fallback: { x: number; y: number }): { x: number; y: number } {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return fallback
  
  try {
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true)
    const rect = range.getBoundingClientRect()
    
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      return fallback
    }
    
    return { x: rect.left, y: rect.top + rect.height / 2 }
  } catch (error) {
    console.warn('Failed to retrieve caret coordinates:', error)
    return fallback
  }
}
