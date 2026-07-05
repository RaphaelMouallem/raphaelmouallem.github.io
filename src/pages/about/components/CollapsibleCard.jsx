import { motion, AnimatePresence } from 'framer-motion'

export default function CollapsibleCard({ mobile, title, glyph, open, onToggle, children }) {
  if (!mobile) {
    return (
      <>
        <p style={styles.cardTag}>{title}</p>
        {children}
      </>
    )
  }

  return (
    <div style={styles.wrapper}>
      <button onClick={onToggle} style={styles.header} data-cursor="hover">
        <span style={styles.glyphRow}>
          {glyph && <span style={styles.glyphCircle}>{glyph}</span>}
          <span style={styles.cardTag}>{title}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={styles.icon}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={styles.body}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const styles = {
  wrapper: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--paper-soft)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '16px 20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    gap: 12,
  },
  cardTag: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
    margin: 0,
  },
  icon: {
    color: 'var(--accent)',
    fontSize: '1.3rem',
    lineHeight: 1,
    flexShrink: 0,
  },
  body: {
    padding: '0 20px 20px',
  },
  glyphRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  glyphCircle: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: '50%',
    border: '1.5px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    color: 'var(--accent)',
    opacity: 0.85,
  },
}
