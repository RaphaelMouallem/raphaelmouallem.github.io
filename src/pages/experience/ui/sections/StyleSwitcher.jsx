import { motion, AnimatePresence } from 'framer-motion'
import { useStyleStore } from '../../store/useStyleStore'
import { STYLE_NAMES } from '../../styles'
import { useStyle } from '@/pages/experience/hooks/useStyle'

const STYLE_LABELS = {
  synthwave: 'Synthwave',
  // TODO add more styles
}

export default function StyleSwitcher({ open, onToggle }) {
  const { theme } = useStyle()
  const { ac } = theme
  const MONO = theme.fontFamily

  const { isDark, toggleDark, activeStyle, setStyle } = useStyleStore()

  const setNext = () => {
    const i = STYLE_NAMES.indexOf(activeStyle)
    setStyle(STYLE_NAMES[(i + 1) % STYLE_NAMES.length])
  }
  const setPrev = () => {
    const i = STYLE_NAMES.indexOf(activeStyle)
    setStyle(STYLE_NAMES[(i - 1 + STYLE_NAMES.length) % STYLE_NAMES.length])
  }

  return (
    <div style={{ position: 'relative', pointerEvents: 'all' }}>
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-label={open ? 'Close style switcher' : 'Open style switcher'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        style={{
          marginLeft: 'auto',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(30,8,48,0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${ac(3)}44`,
          borderRadius: 3,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 13, color: ac(3) }}>{open ? '×' : '◈'}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="switcher"
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 8,
              width: 200,
              background: 'rgba(10,0,20,0.92)',
              backdropFilter: 'blur(20px)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderLeft: `2px solid ${ac(3)}`,
              borderRadius: 3,
              padding: '12px 14px',
              position: 'absolute',
              top: 40,
              right: 0,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: '0.2em',
                color: ac(3),
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 12,
              }}
            >
              &gt;_ switcher
            </span>

            <div style={{ borderLeft: `2px solid ${ac(2)}22`, paddingLeft: 8, marginBottom: 4 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: ac(2),
                  marginBottom: 8,
                }}
              >
                &gt;_ mode
              </div>
              <motion.div
                onClick={toggleDark}
                role="button"
                tabIndex={0}
                aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleDark()
                  }
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  cursor: 'pointer',
                  borderRadius: 2,
                  background: `${ac(isDark ? 2 : 1)}11`,
                  border: `1px solid ${ac(isDark ? 2 : 1)}33`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 10, color: isDark ? ac(2) : ac(1) }}>
                  {isDark ? '☾ night' : '☀ day'}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                  toggle
                </span>
              </motion.div>
            </div>

            {STYLE_NAMES.length > 1 && (
              <div style={{ borderLeft: `2px solid ${ac(0)}22`, paddingLeft: 8, marginTop: 10 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: ac(0),
                    marginBottom: 8,
                  }}
                >
                  &gt;_ artstyle
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}
                >
                  <motion.div
                    onClick={setPrev}
                    role="button"
                    tabIndex={0}
                    aria-label="Previous style"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPrev()
                      }
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: ac(0),
                      cursor: 'pointer',
                      padding: '4px 8px',
                      border: `1px solid ${ac(0)}33`,
                      borderRadius: 2,
                    }}
                  >
                    ‹
                  </motion.div>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.7)',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  >
                    {STYLE_LABELS[activeStyle] ?? activeStyle}
                  </span>
                  <motion.div
                    onClick={setNext}
                    role="button"
                    tabIndex={0}
                    aria-label="Next style"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setNext()
                      }
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: ac(0),
                      cursor: 'pointer',
                      padding: '4px 8px',
                      border: `1px solid ${ac(0)}33`,
                      borderRadius: 2,
                    }}
                  >
                    ›
                  </motion.div>
                </div>
              </div>
            )}

            {STYLE_NAMES.length === 1 && (
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.2)',
                  paddingLeft: 8,
                  marginTop: 6,
                }}
              >
                more styles coming soon
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
