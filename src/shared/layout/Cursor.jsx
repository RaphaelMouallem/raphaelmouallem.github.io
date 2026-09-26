import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'

const easeOut = [0.16, 1, 0.3, 1]
const SPRING = { stiffness: 200, damping: 24 }

const isTouch = window.matchMedia('(pointer: coarse)').matches
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Cursor() {
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState(null)

  const mouseCoords = useMotionValue({ clientX: -100, clientY: -100 })

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const dotX = useSpring(x, { stiffness: 120, damping: 14 })
  const dotY = useSpring(y, { stiffness: 120, damping: 14 })

  const elX = useSpring(0, SPRING)
  const elY = useSpring(0, SPRING)
  const elW = useSpring(40, SPRING)
  const elH = useSpring(40, SPRING)
  const elRadius = useSpring(20, SPRING)

  useEffect(() => {
    if (isTouch || reduced) return

    const hoverTargetRef = { current: null }
    const pointerRef = { current: { x: -100, y: -100 } }
    let rafId = null

    const applyHoverTarget = (target, clientX, clientY) => {
      const rect = target.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const PULL = 0.25
      elX.set(cx + (clientX - cx) * PULL)
      elY.set(cy + (clientY - cy) * PULL)

      elW.set(rect.width + 12)
      elH.set(rect.height + 12)
      const style = window.getComputedStyle(target)
      const parsedRadius = parseFloat(style.borderRadius) || 0
      elRadius.set(parsedRadius > rect.height / 2 ? (rect.height + 12) / 2 : parsedRadius + 6)
    }

    const HOVER_TOLERANCE = 40
    const withinTolerance = (rect, clientX, clientY) => {
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(clientX - cx, clientY - cy)
      const radius = Math.max(rect.width, rect.height) / 2
      return dist <= radius + HOVER_TOLERANCE
    }

    const releaseHover = (clientX, clientY) => {
      hoverTargetRef.current = null
      setHovering(false)
      setLabel(null)
      elX.set(clientX)
      elY.set(clientY)
      elW.set(40)
      elH.set(40)
      elRadius.set(20)
    }

    const updateCursor = (clientX, clientY) => {
      pointerRef.current = { x: clientX, y: clientY }
      x.set(clientX)
      y.set(clientY)

      const target = document.elementFromPoint(clientX, clientY)
      if (!target) return

      const hoverTarget = target.closest('[data-cursor="hover"]')
      const labelTarget = target.closest('[data-cursor-label]')
      const grabTarget = target.closest('[data-cursor="grab"]')

      setLabel(labelTarget ? labelTarget.getAttribute('data-cursor-label') : null)
      setHovering(!!hoverTarget)
      hoverTargetRef.current = hoverTarget || null

      if (hoverTarget) {
        applyHoverTarget(hoverTarget, clientX, clientY)
      } else if (grabTarget) {
        elX.set(clientX)
        elY.set(clientY)
        elW.set(12)
        elH.set(12)
        elRadius.set(6)
      } else {
        elX.set(clientX)
        elY.set(clientY)
        if (labelTarget) {
          elW.set(56)
          elH.set(56)
          elRadius.set(28)
        } else {
          elW.set(40)
          elH.set(40)
          elRadius.set(20)
        }
      }
    }

    const handleMove = (e) => {
      mouseCoords.set({ clientX: e.clientX, clientY: e.clientY })
      updateCursor(e.clientX, e.clientY)
    }

    const handleScroll = () => {
      const { clientX, clientY } = mouseCoords.get()
      updateCursor(clientX, clientY)
    }

    const tick = () => {
      const target = hoverTargetRef.current
      if (target && document.body.contains(target)) {
        const rect = target.getBoundingClientRect()
        const { x: px, y: py } = pointerRef.current
        if (withinTolerance(rect, px, py)) {
          applyHoverTarget(target, px, py)
        } else {
          releaseHover(px, py)
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [x, y, elX, elY, elW, elH, elRadius, mouseCoords])

  if (isTouch || reduced) return null

  const isLabel = !!label && !hovering
  const hoverTag = !!label && hovering

  return (
    <>
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-9998 flex items-center justify-center"
        style={{
          translateX: elX,
          translateY: elY,
          width: elW,
          height: elH,
          x: '-50%',
          y: '-50%',
          borderRadius: elRadius,
        }}
        animate={{
          backgroundColor: isLabel ? 'var(--accent)' : 'transparent',
          borderColor: hovering || isLabel ? 'var(--accent)' : 'var(--ink-faint)',
          borderWidth: isLabel ? 0 : 1,
          borderStyle: 'solid',
        }}
        transition={{ duration: 0.3, ease: easeOut }}
      >
        {isLabel && (
          <m.span
            className="font-body text-[0.5rem] font-semibold tracking-widest uppercase text-paper whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {label}
          </m.span>
        )}
      </m.div>

      {hoverTag && (
        <m.div
          className="fixed top-0 left-0 pointer-events-none z-9998"
          style={{ translateX: elX, translateY: elY, x: '-10%', y: '80%' }}
        >
          <m.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block bg-accent text-paper text-[0.6rem] font-semibold tracking-wider p-[2px_8px_2px_10px] [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%)]"
          >
            {label}
          </m.span>
        </m.div>
      )}
      {!isLabel && !hovering && (
        <m.div
          className="fixed top-0 left-0 w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-accent pointer-events-none z-9999"
          style={{ x: dotX, y: dotY }}
        />
      )}
    </>
  )
}