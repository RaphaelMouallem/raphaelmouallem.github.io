import { useRef } from 'react'
import '@/styles/tokens.css'
import ThemeToggle from '@/components/ThemeToggle'
import Cursor from '@/components/Cursor'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import WindField from '@/assets/motifs/WindField'
import TerminalPetInstance from '@/features/terminal-pet/TerminalPetInstance'

export default function AboutPage() {
  const windZoneRef = useRef(null)
  const footerRef = useRef(null)
  const contactRef = useRef(null)

  return (
    <div className="about-page min-h-screen bg-paper relative text-ink font-body selection:bg-accent selection:text-white">
      <Cursor />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;800&family=Inter:wght@400;500;600&display=swap"
      />

      <header className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </header>

      <main>
        <div className="relative z-0 overflow-hidden" ref={windZoneRef}>
          <div className="relative -z-[1]">
            <Hero />
          </div>
          <WindField containerRef={windZoneRef} />
          <About />
          <Projects />
          <div className="relative" ref={contactRef}>
            <Contact />
          </div>
        </div>
        <div className="relative" ref={footerRef}>
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
