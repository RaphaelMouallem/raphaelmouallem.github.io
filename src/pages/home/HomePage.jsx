import '@/styles/tokens.css'
import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import Cursor from '@/shared/layout/Cursor'
import PageMeta from '@/shared/layout/PageMeta'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WindField from '@/shared/motifs/WindField'
import TerminalPetInstance from '@/features/terminal-pet/TerminalPetInstance'

export default function AboutPage() {
  const windZoneRef = useRef(null)
  const footerRef = useRef(null)
  const contactRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="about-page min-h-screen bg-paper relative text-ink font-body selection:bg-accent selection:text-white">
      <PageMeta
        title="Raphael El Mouallem · Software Engineer · Full Stack & AI Developer"
        description="Software engineer in Lebanon with a Master's in Web Development, building across the stack: React, Spring Boot, PyTorch. Focused on where systems and AI meet."
        path="/"
      />
      <Cursor />
      <main>
        <div className="relative z-0 overflow-hidden" ref={windZoneRef}>
          <div className="relative z-[-1]">
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
      {!prefersReducedMotion && (
        <>
          <TerminalPetInstance size={80} spawnRef={contactRef} />
          <TerminalPetInstance size={80} spawnRef={footerRef} />
          <TerminalPetInstance size={80} spawnRef={footerRef} />
        </>
      )}
    </div>
  )
}
