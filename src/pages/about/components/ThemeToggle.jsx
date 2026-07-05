import { useTheme } from '../hooks/useTheme'
import { useMagnetic } from '../hooks/useMagnetic'
import { motion } from 'framer-motion'

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
      style={{ ...styles.button, x: magnetic.x, y: magnetic.y }}
    >
      {theme === 'dark' ? '☼' : '☽'}
    </motion.button>
  )
}

const styles = {
  button: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid var(--border)',
    background: 'var(--paper-soft)',
    color: 'var(--ink)',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
}
