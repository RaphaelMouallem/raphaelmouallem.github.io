import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { useState, useEffect, useRef } from 'react'
import {
  ac,
  glass,
  Eyebrow,
  Tag,
  MONO,
  CollapsibleCard,
} from '@/pages/experience/styles/synthwave/ui/kit'
import { useScrollLock } from '@/ui/components/utils'

const variants = {
  bio: { hidden: { x: -60, opacity: 0 }, show: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } },
  edu: { hidden: { x: 60, opacity: 0 }, show: { x: 0, opacity: 1 }, exit: { x: 40, opacity: 0 } },
  stack: {
    hidden: { y: 50, opacity: 0 },
    show: { x: 0, y: 0, opacity: 1 },
    exit: { y: 40, opacity: 0 },
  },
  site: {
    hidden: { y: -40, opacity: 0 },
    show: { x: 0, y: 0, opacity: 1 },
    exit: { y: -30, opacity: 0 },
  },
}

const t = (delay = 0) => ({ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] })

function Card({ v, delay, accent, children }) {
  return (
    <motion.div
      variants={variants[v]}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={t(delay)}
      style={{ ...glass(accent), padding: '20px' }}
    >
      {children}
    </motion.div>
  )
}

function BioContent({ about }) {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: 12,
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.88)',
        margin: 0,
      }}
    >
      {about.bio}
    </p>
  )
}

function EduContent({ about }) {
  return (
    <>
      {about.education.map((e) => (
        <div
          key={e.degree}
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.5,
            }}
          >
            {e.degree}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            {e.period}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {about.spoken.map((l) => (
          <Tag key={l} color={ac(1)}>
            {l}
          </Tag>
        ))}
      </div>
    </>
  )
}

function StackContent({ about }) {
  return (
    <>
      {Object.entries(about.skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 8 }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 9,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 4px',
            }}
          >
            {cat}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {items.map((s) => (
              <Tag key={s} color={ac(2)}>
                {s}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function SiteContent({ site }) {
  return (
    <>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 12,
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.82)',
          margin: '0 0 14px',
        }}
      >
        {site.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {site.stack.map((s) => (
          <Tag key={s} color={ac(3)}>
            {s}
          </Tag>
        ))}
      </div>
    </>
  )
}

export default function AboutCards({ visible, isMobile, scrollCard }) {
  const [openCard, setOpenCard] = useState(0)

  useEffect(() => {
    setOpenCard(scrollCard)
  }, [scrollCard])

  const { about, pages } = useContent()
  const site = pages.synthwave.site

  const scrollRef = useRef(null)
  useScrollLock(scrollRef, isMobile)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={scrollRef}
          key={isMobile ? 'about-mob' : 'about-desk'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={
            isMobile
              ? {
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  right: 16,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '12px 0',
                  pointerEvents: 'none',
                  overflowY: 'auto',
                  maxHeight: '80vh',
                }
              : {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(840px, 90vw)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  pointerEvents: 'none',
                }
          }
        >
          {' '}
          {isMobile ? (
            <>
              <CollapsibleCard
                id={0}
                label="whoami"
                accent={ac(0)}
                open={openCard === 0}
                onToggle={() => setOpenCard((o) => (o === 0 ? null : 0))}
              >
                <BioContent about={about} />
              </CollapsibleCard>
              <CollapsibleCard
                id={1}
                label="education"
                accent={ac(1)}
                open={openCard === 1}
                onToggle={() => setOpenCard((o) => (o === 1 ? null : 1))}
              >
                <EduContent about={about} />
              </CollapsibleCard>
              <CollapsibleCard
                id={2}
                label="stack"
                accent={ac(2)}
                open={openCard === 2}
                onToggle={() => setOpenCard((o) => (o === 2 ? null : 2))}
              >
                <StackContent about={about} />
              </CollapsibleCard>
              <CollapsibleCard
                id={3}
                label="this site"
                accent={ac(3)}
                open={openCard === 3}
                onToggle={() => setOpenCard((o) => (o === 3 ? null : 3))}
              >
                <SiteContent site={site} />
              </CollapsibleCard>
            </>
          ) : (
            <>
              <Card key="bio" v="bio" delay={0} accent={ac(0)}>
                <Eyebrow color={ac(0)}>whoami</Eyebrow>
                <BioContent about={about} />
              </Card>
              <Card key="edu" v="edu" delay={0.1} accent={ac(1)}>
                <Eyebrow color={ac(1)}>education</Eyebrow>
                <EduContent about={about} />
              </Card>
              <Card key="stack" v="stack" delay={0.18} accent={ac(2)}>
                <Eyebrow color={ac(2)}>stack</Eyebrow>
                <StackContent about={about} />
              </Card>
              <Card key="site" v="site" delay={0.26} accent={ac(3)}>
                <Eyebrow color={ac(3)}>this site</Eyebrow>
                <SiteContent site={site} />
              </Card>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
