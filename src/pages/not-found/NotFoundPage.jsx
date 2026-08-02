import { Link } from 'react-router-dom'
import '../about/tokens.css'
import ThemeToggle from '../about/components/ThemeToggle'
import PaperCard from '../about/components/PaperCard'

export default function NotFoundPage() {
  return (
    <div className="about-page" style={styles.page}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;800&family=Inter:wght@400;500;600&display=swap"
      />

      <header style={styles.header}>
        <ThemeToggle />
      </header>

      <main style={styles.main}>
        <PaperCard style={styles.card}>
          <span style={styles.eyebrow}>404</span>
          <h1 style={styles.heading}>Page not found</h1>
          <p style={styles.copy}>
            There's nothing at this address. It may have moved, or never existed.
          </p>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>
              Back home
            </Link>
            <Link to="/3d" style={styles.link}>
              Enter exploration mode
            </Link>
          </div>
        </PaperCard>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
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
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxWidth: 420,
    textAlign: 'center',
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: 10,
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 800,
    margin: '0 0 12px',
  },
  copy: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink-soft)',
    margin: '0 0 28px',
    lineHeight: 1.6,
  },
  links: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--accent)',
    textDecoration: 'none',
  },
}
