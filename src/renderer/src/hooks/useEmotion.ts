import { useState, useCallback, useRef, useEffect } from 'react'

export type Emotion = 'idle' | 'happy' | 'thinking' | 'sad'

export function useEmotion(timeoutMs = 5000) {
  const [emotion, setEmotion] = useState<Emotion>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetToIdle = useCallback(() => {
    setEmotion('idle')
  }, [])

  const setEmotionWithTimeout = useCallback(
    (newEmotion: Emotion) => {
      setEmotion(newEmotion)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout to return to idle (except for idle itself)
      if (newEmotion !== 'idle') {
        timeoutRef.current = setTimeout(resetToIdle, timeoutMs)
      }
    },
    [timeoutMs, resetToIdle]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { emotion, setEmotion: setEmotionWithTimeout, resetToIdle }
}
