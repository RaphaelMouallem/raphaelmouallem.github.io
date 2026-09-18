import { useState, useEffect } from 'react'
import { createHopEngine } from './hopEngine'
import { registerPet, unregisterPet, updatePetPosition } from './petRegistry'

export function useHopEngine(config) {
  const [engine] = useState(() => createHopEngine(config))
  const [state, setState] = useState(() => engine.getState())

  useEffect(() => {
    engine.setBounds(config.bounds)
  }, [engine, config.bounds])

  useEffect(() => {
    if (!config.id) return
    registerPet(config.id)
    return () => unregisterPet(config.id)
  }, [config.id])

  useEffect(() => {
    let raf
    const loop = (now) => {
      const next = engine.tick(now)
      if (config.id) updatePetPosition(config.id, next.x, next.y)
      setState(next)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [engine, config.id])

  const interact = () => setState(engine.interact(performance.now()))

  return { ...state, interact }
}
