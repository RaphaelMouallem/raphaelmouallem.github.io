import { useRef, useState, useEffect } from 'react'
import { createMoodEngine } from './moodEngine'

const FLICKER_MOODS = ['glitch', 'loading']
const IDLE_RANGE = [5000, 10000]
const FLICKER_DURATION = 400

export function useMoodEngine(config) {
  const engineRef = useRef(null)
  if (!engineRef.current) engineRef.current = createMoodEngine(config)
  const [state, setState] = useState(engineRef.current.getState())

  const trigger = (mood) => setState(engineRef.current.trigger(mood))

  useEffect(() => {
    let idleTimer, revertTimer
    const scheduleIdle = () => {
      const [min, max] = IDLE_RANGE
      idleTimer = setTimeout(
        () => {
          setState(engineRef.current.flicker(FLICKER_MOODS))
          revertTimer = setTimeout(() => {
            setState(engineRef.current.revert())
            scheduleIdle()
          }, FLICKER_DURATION)
        },
        min + Math.random() * (max - min)
      )
    }
    scheduleIdle()
    return () => {
      clearTimeout(idleTimer)
      clearTimeout(revertTimer)
    }
  }, [])

  return { ...state, trigger }
}
