import { useTheme } from '../hooks/useTheme'
import { useMagnetic } from '../hooks/useMagnetic'
import { motion } from 'framer-motion'
import { easeOut } from '../motion'

const DAY = 'var(--paper-soft)'
const NIGHT = 'var(--ink)'

function YinYangIcon({ theme }) {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
      transition={{ type: 'spring', duration: 0.6, bounce: 0.22 }}
    >
      <circle cx="12" cy="12" r="11" fill={NIGHT} />
      <path
        d="M12,1 A11,11 0 0,1 12,23 A5.5,5.5 0 0,1 12,12 A5.5,5.5 0 0,0 12,1 Z"
        fill={DAY}
      />

      <circle cx="12" cy="6" r="2.7" fill={NIGHT} />
      <g stroke={DAY} strokeWidth="0.9" strokeLinecap="round">
        <line x1="12" y1="3.9" x2="12" y2="4.5" />
        <line x1="12" y1="7.5" x2="12" y2="8.1" />
        <line x1="9.9" y1="6" x2="10.5" y2="6" />
        <line x1="13.5" y1="6" x2="14.1" y2="6" />
      </g>

      <circle cx="12" cy="18" r="2.2" fill={DAY} />
      <circle cx="11.3" cy="17.4" r="0.5" fill={NIGHT} />
      <circle cx="12.6" cy="18.6" r="0.35" fill={NIGHT} />
    </motion.svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const magnetic = useMagnetic(8)

  return (
    <motion.button
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      onClick={toggle}
      data-cursor="hover"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15, ease: easeOut }}
      style={{ ...styles.button, x: magnetic.x, y: magnetic.y }}
    >
      <YinYangIcon theme={theme} />
    </motion.button>
  )
}

const styles = {
  button: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    background: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}