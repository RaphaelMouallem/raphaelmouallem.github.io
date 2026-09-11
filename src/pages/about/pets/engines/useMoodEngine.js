import { useState, useEffect } from 'react'
import { createMoodEngine } from './moodEngine'

const FLICKER_MOODS = ['glitch', 'loading']
const IDLE_RANGE = [5000, 10000]
const FLICKER_DURATION = 400

export function useMoodEngine(config) {
  const [engine] = useState(() => createMoodEngine(config))
  const [state, setState] = useState(() => engine.getState())

  const trigger = (mood) => setState(engine.trigger(mood))

  useEffect(() => {
    let idleTimer, revertTimer
    const scheduleIdle = () => {
      const [min, max] = IDLE_RANGE
      idleTimer = setTimeout(
        () => {
          setState(engine.flicker(FLICKER_MOODS))
          revertTimer = setTimeout(() => {
            setState(engine.revert())
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
  }, [engine])

  return { ...state, trigger }
}
