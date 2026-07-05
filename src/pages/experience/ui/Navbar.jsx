import { useScroll, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { useStyle } from '../hooks/useStyle'

function NavDot({ section, isActive, onClick, isMobile }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Jump to ${section.label} section`}
      aria-current={isActive ? 'true' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-end',
        cursor: 'pointer',
        height: isMobile ? 'auto' : '20px',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '4px' : '0',
      }}
    >
      {!isMobile && (
        <span
          style={{
            color: '#fff',
            fontSize: '13px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginRight: '8px',
            opacity: hovered ? 1 : 0,
            maxWidth: hovered ? '80px' : '0px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          {section.label}
        </span>
      )}
      <div
        style={{
          width: isActive ? '10px' : '6px',
          height: isActive ? '10px' : '6px',
          borderRadius: '50%',
          background: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      />
      {isMobile && (
        <span
          style={{
            color: '#fff',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: isActive ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        >
          {section.label}
        </span>
      )}
    </div>
  )
}

export default function Navbar() {
  const { sections, theme } = useStyle()
  const dots = sections.filter((s) => s.label)
  const scroll = useScroll()
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useFrame(() => {
    const i = dots.findIndex((s, idx) => {
      const next = dots[idx + 1]
      return scroll.offset >= s.from && (!next || scroll.offset < next.from)
    })
    if (i !== -1) setActive(i)
  })

  return (
    <Html fullscreen>
      <style>{`@import url('${theme.googleFont}');`}</style>
      <nav
        style={
          isMobile
            ? {
                fontFamily: theme.fontFamily,
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                zIndex: 100,
              }
            : {
                fontFamily: theme.fontFamily,
                position: 'fixed',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 100,
              }
        }
      >
        {dots.map((s, i) => (
          <NavDot
            key={s.label}
            section={s}
            isActive={i === active}
            isMobile={isMobile}
            onClick={() => {
              scroll.el.scrollTop = s.from * scroll.el.scrollHeight
            }}
          />
        ))}
      </nav>
    </Html>
  )
}
