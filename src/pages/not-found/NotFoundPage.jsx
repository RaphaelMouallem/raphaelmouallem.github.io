import { Link } from 'react-router-dom'
import '../about/tokens.css'
import ThemeToggle from '../about/components/ThemeToggle'
import CharacterRain, { WATER_LINE_VH } from '../../assets/CharacterRain'

export default function NotFoundPage() {
  return (
    <div className="about-page" style={styles.page}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;800&family=Inter:wght@400;500;600&display=swap"
      />

      <CharacterRain />

      <header style={styles.header}>
        <ThemeToggle />
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.heading}>404</h1>
          <p style={styles.copy}>
            There's nothing at this address. It may have moved, or never existed.
          </p>
        </div>

        <div style={styles.actions}>
          <Link to="/" className="press-tap" style={styles.link}>
            Back home
          </Link>
          <Link to="/3d" className="press-tap" style={styles.link}>
            Enter exploration mode
          </Link>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
    transition: 'background 0.3s ease, color 0.3s ease',
  },
  header: {
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  main: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    pointerEvents: 'none',
  },
  content: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: '28vh',
    maxWidth: 560,
    pointerEvents: 'auto',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3.5rem, 9vw, 6rem)',
    fontWeight: 800,
    margin: '0 0 20px',
    lineHeight: 1,
  },
  copy: {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--ink-soft)',
    margin: 0,
    lineHeight: 1.7,
    maxWidth: 460,
  },
  actions: {
    position: 'absolute',
    left: '8%',
    top: `calc(${WATER_LINE_VH}vh + 36px)`,
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    pointerEvents: 'auto',
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: 'var(--ink)',
    textDecoration: 'none',
    padding: '14px 26px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'var(--paper-raised)',
  },
}