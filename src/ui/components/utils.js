import { useState, useEffect } from 'react'

export function norm(v, min, max) {
  return Math.min(1, Math.max(0, (v - min) / (max - min)))
}

export function useScrollLock(ref, enabled = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const getOverlay = () => document.querySelector('[style*="overflow: hidden auto"]')

    const lock = () => {
      const o = getOverlay()
      if (o) o.style.pointerEvents = 'none'
    }
    const unlock = () => {
      const o = getOverlay()
      if (o) o.style.pointerEvents = 'auto'
    }

    el.addEventListener('touchstart', lock, { passive: true })
    el.addEventListener('touchend', unlock, { passive: true })
    el.addEventListener('touchcancel', unlock, { passive: true })

    return () => {
      el.removeEventListener('touchstart', lock)
      el.removeEventListener('touchend', unlock)
      el.removeEventListener('touchcancel', unlock)
      unlock()
    }
  }, [ref, enabled])
}

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
