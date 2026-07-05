import { useRef, useState, useEffect } from 'react'
import { createHopEngine } from './hopEngine'
import { registerPet, unregisterPet, updatePetPosition } from './petRegistry'

export function useHopEngine(config) {
  const engineRef = useRef(null)
  if (!engineRef.current) engineRef.current = createHopEngine(config)
  const [state, setState] = useState(engineRef.current.getState())

  useEffect(() => {
    engineRef.current.setBounds(config.bounds)
  }, [config.bounds])

  useEffect(() => {
    if (!config.id) return
    registerPet(config.id)
    return () => unregisterPet(config.id)
  }, [config.id])

  useEffect(() => {
    let raf
    const loop = (now) => {
      const next = engineRef.current.tick(now)
      if (config.id) updatePetPosition(config.id, next.x, next.y)
      setState(next)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const interact = () => setState(engineRef.current.interact(performance.now()))

  return { ...state, interact }
}
