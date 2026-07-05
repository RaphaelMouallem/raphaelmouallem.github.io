import { useRef, useState } from 'react'
import { Html, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { norm, useIsMobile } from '../../../ui/components/utils'
import { useStyle } from '../hooks/useStyle'
import StyleSwitcher from './sections/StyleSwitcher'

export default function UI() {
  const scroll = useScroll()
  const isMobile = useIsMobile()
  const offsetRef = useRef(0)
  const { sections, Cards, ConfigPanel } = useStyle()
  const [section, setSection] = useState('intro')
  const [projectProgress, setProjectProgress] = useState(0)
  const [aboutCard, setAboutCard] = useState(0)
  const [configOpen, setConfigOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)

  const handleConfigToggle = () => {
    setConfigOpen((o) => !o)
    setSwitcherOpen(false)
  }
  const handleSwitcherToggle = () => {
    setSwitcherOpen((o) => !o)
    setConfigOpen(false)
  }

  useFrame(() => {
    const o = scroll.offset
    if (Math.abs(o - offsetRef.current) < 0.0005) return
    offsetRef.current = o

    const current = sections.find((s) => o >= s.from && o < s.to) ?? sections.at(-1)
    setSection(current.label.toLowerCase())

    const proj = sections.find((s) => s.label === 'Projects')
    if (proj && o >= proj.from && o < proj.to) setProjectProgress(norm(o, proj.from, proj.to))

    const about = sections.find((s) => s.label === 'About')
    if (about && o >= about.from && o < about.to)
      setAboutCard(Math.min(3, Math.floor(norm(o, about.from, about.to) * 4)))
  })

  return (
    <Html fullscreen>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing: border-box; }
        a:hover { opacity: 0.75; }
        @media (max-width: 767px) {
          * { font-weight: 700 !important;}
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Cards
          section={section}
          isMobile={isMobile}
          scrollCard={aboutCard}
          progress={projectProgress}
        />
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 200,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            pointerEvents: 'all',
          }}
        >
          <ConfigPanel open={configOpen} onToggle={handleConfigToggle} />
          <StyleSwitcher open={switcherOpen} onToggle={handleSwitcherToggle} />
        </div>
      </div>
    </Html>
  )
}
