import { useEffect, useState } from 'react'

/**
 * Tracks normalized mouse position relative to viewport center, range ~[-1, 1].
 * Returns { x: 0, y: 0 } on touch devices or when prefers-reduced-motion is set.
 */
export function useMouseDrift() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduced) return

    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setPos({ x, y })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return pos
}
