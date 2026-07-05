import { useRef } from 'react'
import './tokens.css'
import ThemeToggle from './components/ThemeToggle'
import Cursor from './components/Cursor'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import WindField from './assets/WindField'
import TerminalPet from './pets/terminal/TerminalPet'
import TerminalPetInstance from './pets/terminal/TerminalPetInstance'

export default function AboutPage() {
  const windZoneRef = useRef(null)
  const footerRef = useRef(null)
  const contactRef = useRef(null)

  return (
    <div className="about-page" style={styles.page}>
      <Cursor />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;800&family=Inter:wght@400;500;600&display=swap"
      />

      <header style={styles.header}>
        <ThemeToggle />
      </header>

      <main>
        <div style={styles.windZone} ref={windZoneRef}>
          <div style={{ position: 'relative', zIndex: -1 }}>
            <Hero />
          </div>
          <WindField containerRef={windZoneRef} />
          <About />
          <Projects />
          <div style={{ position: 'relative' }} ref={contactRef}>
            <Contact />
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={footerRef}>
          <Footer />
        </div>
      </main>
      <TerminalPetInstance size={80} spawnRef={contactRef} />
      <TerminalPetInstance size={80} spawnRef={contactRef} />
      <TerminalPetInstance size={80} spawnRef={footerRef} />
      <TerminalPetInstance size={80} spawnRef={footerRef} />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--paper)',
    position: 'relative',
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
  windZone: {
    position: 'relative',
    zIndex: 0,
    overflow: 'hidden',
  },
}
