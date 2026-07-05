import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import {
  ac,
  glass,
  Eyebrow,
  Tag,
  MONO,
  CollapsibleCard,
} from '@/pages/experience/styles/synthwave/ui/kit'
import { useScrollLock } from '@/ui/components/utils'

const SCATTER = [
  { left: '4vw', top: '8vh' },
  { left: '54vw', top: '6vh' },
  { left: '6vw', top: '48vh' },
  { left: '56vw', top: '46vh' },
  { left: '26vw', top: '68vh' },
]

function popupStyle(index, color) {
  const pos = SCATTER[index]
  const isRight = parseFloat(pos.left) > 40
  const isBottom = parseFloat(pos.top) > 50
  return {
    background: 'rgba(30, 8, 48, 0.95)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: `1px solid rgba(255,255,255,0.10)`,
    borderLeft: `2px solid ${color}`,
    borderRadius: 3,
    position: 'absolute',
    ...(isBottom ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
    width: 300,
    padding: 16,
    zIndex: 50,
    pointerEvents: 'none',
  }
}

function ProjectContent({ project, index }) {
  const color = ac(index)
  return (
    <>
      <h3
        style={{
          fontFamily: MONO,
          fontSize: 15,
          fontWeight: 700,
          margin: '0 0 3px',
          color: '#fff',
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: 'rgba(255,255,255,0.4)',
          margin: '0 0 10px',
        }}
      >
        {project.subtitle}
      </p>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 11,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.78)',
          margin: '0 0 8px',
        }}
      >
        {project.description}
      </p>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: project.github ? 8 : 0 }}
      >
        {project.tags.map((t) => (
          <Tag key={t} color={color}>
            {t}
          </Tag>
        ))}
      </div>
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 8,
            fontFamily: MONO,
            fontSize: 11,
            color: ac(1),
            textDecoration: 'none',
            pointerEvents: 'all',
          }}
        >
          github →
        </a>
      )}
    </>
  )
}

function ProjectCard({ project, index, active, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const color = ac(index)
  const isActive = active || hovered

  if (isMobile) {
    return (
      <div style={{ ...glass(color), padding: '16px 18px' }}>
        <Eyebrow color={color}>project.{String(index + 1).padStart(2, '0')}</Eyebrow>
        <ProjectContent project={project} index={index} />
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...SCATTER[index],
        zIndex: hovered ? 30 : 10,
        pointerEvents: 'all',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.38, scale: isActive ? 1.03 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          ...glass(color),
          padding: '16px 18px',
          width: 210,
          cursor: 'default',
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <Eyebrow color={color}>project.{String(index + 1).padStart(2, '0')}</Eyebrow>
        <h3
          style={{
            fontFamily: MONO,
            fontSize: 15,
            fontWeight: 700,
            margin: '0 0 3px',
            color: '#fff',
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 10px',
          }}
        >
          {project.subtitle}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.tags.slice(0, 3).map((t) => (
            <Tag key={t} color={color}>
              {t}
            </Tag>
          ))}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              style={popupStyle(index, ac(index + 1))}
            >
              <div
                style={{
                  width: '100%',
                  height: 100,
                  background: `linear-gradient(135deg, ${color}22, ${ac(index + 1)}22)`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.1em',
                  }}
                >
                  [ screenshot ]
                </span>
              </div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.82)',
                  margin: '0 0 10px',
                }}
              >
                {project.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  marginBottom: project.github ? 10 : 0,
                }}
              >
                {project.tags.map((t) => (
                  <Tag key={t} color={color}>
                    {t}
                  </Tag>
                ))}
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: ac(1),
                    textDecoration: 'none',
                    borderBottom: `1px solid ${ac(1)}55`,
                    paddingBottom: 1,
                    pointerEvents: 'all',
                  }}
                >
                  github →
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function ProjectsLayer({ visible, progress, isMobile }) {
  const { projects } = useContent()
  const activeIndex = Math.min(Math.floor(progress * projects.length), projects.length - 1)
  const [openCard, setOpenCard] = useState(0)
  useEffect(() => {
    setOpenCard(activeIndex)
  }, [activeIndex])

  const scrollRef = useRef(null)
  useScrollLock(scrollRef, isMobile)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={scrollRef}
          key={isMobile ? 'proj-mob' : 'proj-desk'}
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
                  inset: 0,
                  pointerEvents: 'none',
                }
          }
        >
          {isMobile
            ? projects.map((p, i) => (
                <CollapsibleCard
                  key={p.id}
                  label={`project.${String(i + 1).padStart(2, '0')}`}
                  accent={ac(i)}
                  open={openCard === i}
                  onToggle={() => setOpenCard((o) => (o === i ? null : i))}
                >
                  <ProjectContent project={p} index={i} />
                </CollapsibleCard>
              ))
            : projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  active={i === activeIndex}
                  isMobile={false}
                />
              ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
