import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 640) {
  const [mob, setMob] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const h = (e) => setMob(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [breakpoint])
  return mob
}
