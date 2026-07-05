import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../theme'

export const MONO = theme.fontFamily

export const glass = (accent) => ({
  background: 'rgba(30, 8, 48, 0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: `1px solid rgba(255,255,255,0.10)`,
  borderLeft: `2px solid ${accent}`,
  borderRadius: 3,
  pointerEvents: 'none',
})

export function Eyebrow({ color, children }) {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
        margin: '0 0 8px',
      }}
    >
      &gt;_ {children}
    </p>
  )
}

export function Tag({ color, children }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        padding: '2px 7px',
        border: `1px solid ${color}55`,
        borderRadius: 2,
        color: `${color}cc`,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function CollapsibleCard({ label, accent, open, onToggle, children }) {
  return (
    <motion.div
      animate={{ width: open ? '100%' : '60%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ ...glass(accent), overflow: 'hidden', pointerEvents: 'all' }}
    >
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          cursor: 'pointer',
          gap: 24,
        }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accent,
            margin: 0,
          }}
        >
          &gt;_ {label}
        </p>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: MONO, fontSize: 14, color: accent, lineHeight: 1 }}
        >
          ›
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 16px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export { ac } from '../theme'
