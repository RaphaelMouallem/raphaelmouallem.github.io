import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const easeOut = [0.16, 1, 0.3, 1]
const SPRING = { stiffness: 200, damping: 24 }

const isTouch = window.matchMedia('(pointer: coarse)').matches
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Cursor() {
  if (isTouch || reduced) return null

  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState(null)
  const [grabbing, setGrabbing] = useState(false)

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
    const updateCursor = (clientX, clientY) => {
      x.set(clientX)
      y.set(clientY)

      const target = document.elementFromPoint(clientX, clientY)
      if (!target) return

      const hoverTarget = target.closest('[data-cursor="hover"]')
      const labelTarget = target.closest('[data-cursor-label]')
      const grabTarget = target.closest('[data-cursor="grab"]')

      setLabel(labelTarget ? labelTarget.getAttribute('data-cursor-label') : null)
      setHovering(!!hoverTarget)
      setGrabbing(!!grabTarget && !hoverTarget)

      if (hoverTarget) {
        const rect = hoverTarget.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const PULL = 0.25
        elX.set(cx + (clientX - cx) * PULL)
        elY.set(cy + (clientY - cy) * PULL)

        elW.set(rect.width + 12)
        elH.set(rect.height + 12)
        const style = window.getComputedStyle(hoverTarget)
        const parsedRadius = parseFloat(style.borderRadius) || 0
        elRadius.set(parsedRadius > rect.height / 2 ? (rect.height + 12) / 2 : parsedRadius + 6)
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

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [x, y, elX, elY, elW, elH, elRadius, mouseCoords])

  const isLabel = !!label && !hovering
  const hoverTag = !!label && hovering

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          translateX: elX,
          translateY: elY,
          width: elW,
          height: elH,
          x: '-50%',
          y: '-50%',
          borderRadius: elRadius,
          pointerEvents: 'none',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <motion.span
            style={styles.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {hoverTag && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            translateX: elX,
            translateY: elY,
            x: '-10%',
            y: '80%',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        >
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              padding: '2px 8px 2px 10px',
              clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            {label}
          </motion.span>
        </motion.div>
      )}
      {!isLabel && !hovering && <motion.div style={{ ...styles.dot, x: dotX, y: dotY }} />}
    </>
  )
}

const styles = {
  dot: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 4,
    height: 4,
    marginLeft: -2,
    marginTop: -2,
    borderRadius: '50%',
    background: 'var(--accent)',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.5rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--paper)',
    whiteSpace: 'nowrap',
  },
}
