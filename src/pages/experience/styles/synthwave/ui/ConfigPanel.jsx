import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsoleStore } from '../../../store/useConsoleStore'
import { useStyleStore } from '../../../store/useStyleStore'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { ac, MONO } from '@/pages/experience/styles/synthwave/ui/kit'

const RANGES = {
  'grid.opacity': { min: 0, max: 1, step: 0.01 },
  'grid.radius': { min: 100, max: 500, step: 10 },
  'grid.segments': { min: 8, max: 48, step: 4 },
  'sun.glowRadius': { min: 1, max: 10, step: 0.1 },
  'sun.sunScale': { min: 0.05, max: 0.6, step: 0.01 },
  'stars.small.count': { min: 50, max: 800, step: 50 },
  'stars.large.count': { min: 5, max: 60, step: 5 },
  'stars.shooting.speed': { min: 0.5, max: 5, step: 0.1 },
  'stars.shooting.length': { min: 10, max: 120, step: 5 },
  'stars.galaxies.count': { min: 2, max: 20, step: 1 },
  'stars.constellations.count': { min: 2, max: 20, step: 1 },
  'stars.constellations.lineOpacity': { min: 0.25, max: 2, step: 0.01 },
  'stars.constellations.starSize': { min: 0.5, max: 2, step: 0.1 },
  'jellyfish.count': { min: 1, max: 12, step: 1 },
  'jellyfish.scale': { min: 0.3, max: 3, step: 0.1 },
  'jellyfish.pulseSpeed': { min: 0.2, max: 3, step: 0.1 },
  'water.surface.waveSpeed': { min: 0.1, max: 2, step: 0.05 },
  'water.bubbles.count': { min: 5, max: 80, step: 5 },
  'water.godRays.count': { min: 4, max: 48, step: 4 },
  'water.godRays.opacity': { min: 0, max: 0.3, step: 0.01 },
  'water.crt.count': { min: 1, max: 20, step: 1 },
  'water.caustics.scale': { min: 5, max: 40, step: 1 },
  'water.caustics.speed': { min: 0.05, max: 1, step: 0.05 },
  'water.caustics.intensity': { min: 0, max: 1, step: 0.05 },
  'clouds.cloudCount': { min: 20, max: 300, step: 10 },
  'clouds.spread': { min: 60, max: 360, step: 10 },
  'cassettes.count': { min: 2, max: 30, step: 1 },
  'cassettes.scale': { min: 0.3, max: 4, step: 0.1 },
}

const isColor = (v) => typeof v === 'string' && v.startsWith('#')
const isNumber = (v) => typeof v === 'number'

function label(key) {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase()
}

function ColorInput({ path, value }) {
  const setOverride = useConsoleStore((s) => s.setOverride)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => setOverride(path, e.target.value)}
        style={{
          width: 24,
          height: 24,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          borderRadius: 2,
        }}
      />
      <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.5)', flex: 1 }}>
        {label(path.split('.').at(-1))}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
        {value}
      </span>
    </div>
  )
}

function SliderInput({ path, value }) {
  const setOverride = useConsoleStore((s) => s.setOverride)
  const range = RANGES[path] ?? { min: 0, max: 100, step: 1 }
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
          {label(path.split('.').at(-1))}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => setOverride(path, parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: ac(2), height: 2 }}
      />
    </div>
  )
}

function AccordionGroup({ title, accent, children, isOpen, onOpen }) {
  return (
    <div style={{ marginBottom: 4, borderLeft: `2px solid ${accent}22`, paddingLeft: 8 }}>
      <div
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${title} settings`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 0',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          &gt;_ {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: MONO, fontSize: 12, color: accent, lineHeight: 1 }}
        >
          ›
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 8 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ConfigSection({ title, accent, obj, prefix, isOpen, onOpen }) {
  const [openChild, setOpenChild] = useState(null)
  const items = []

  for (const [k, v] of Object.entries(obj ?? {})) {
    const path = `${prefix}.${k}`
    if (isColor(v)) {
      items.push(<ColorInput key={path} path={path} value={v} />)
    } else if (isNumber(v) && RANGES[path]) {
      items.push(<SliderInput key={path} path={path} value={v} />)
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      items.push(
        <ConfigSection
          key={path}
          title={k}
          accent={accent}
          obj={v}
          prefix={path}
          isOpen={openChild === k}
          onOpen={() => setOpenChild((c) => (c === k ? null : k))}
        />
      )
    }
  }

  if (!items.length) return null
  return (
    <AccordionGroup title={title} accent={accent} isOpen={isOpen} onOpen={onOpen}>
      {items}
    </AccordionGroup>
  )
}

export default function ConfigPanel({ open, onToggle }) {
  const cfg = useConfig()
  const isDark = useStyleStore((s) => s.isDark)
  const resetOverrides = useConsoleStore((s) => s.resetOverrides)
  const [openGroup, setOpenChild] = useState(null)
  const toggle = (k) => setOpenChild((c) => (c === k ? null : k))

  return (
    <div style={{ position: 'relative', pointerEvents: 'all' }}>
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-label={open ? 'Close settings panel' : 'Open settings panel'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        style={{
          marginLeft: 'auto',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(30,8,48,0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${ac(0)}44`,
          borderRadius: 3,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 14, color: ac(0) }}>{open ? '×' : '⚙'}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 8,
              width: 240,
              background: 'rgba(10,0,20,0.92)',
              backdropFilter: 'blur(20px)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderLeft: `2px solid ${ac(0)}`,
              borderRadius: 3,
              padding: '12px 14px',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'absolute',
              top: 40,
              right: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: ac(0),
                  textTransform: 'uppercase',
                }}
              >
                &gt;_ config
              </span>
              <span
                onClick={resetOverrides}
                role="button"
                tabIndex={0}
                aria-label="Reset settings to defaults"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    resetOverrides()
                  }
                }}
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                }}
              >
                reset
              </span>
            </div>

            <ConfigSection
              title="sky"
              accent={ac(0)}
              obj={cfg.sky}
              prefix="sky"
              isOpen={openGroup === 'sky'}
              onOpen={() => toggle('sky')}
            />
            <ConfigSection
              title="grid"
              accent={ac(1)}
              obj={cfg.grid}
              prefix="grid"
              isOpen={openGroup === 'grid'}
              onOpen={() => toggle('grid')}
            />
            <ConfigSection
              title="sun"
              accent={ac(2)}
              obj={cfg.sun}
              prefix="sun"
              isOpen={openGroup === 'sun'}
              onOpen={() => toggle('sun')}
            />
            {isDark && (
              <ConfigSection
                title="stars"
                accent={ac(3)}
                obj={cfg.stars}
                prefix="stars"
                isOpen={openGroup === 'stars'}
                onOpen={() => toggle('stars')}
              />
            )}
            {isDark && (
              <ConfigSection
                title="jellyfish"
                accent={ac(3)}
                obj={cfg.jellyfish}
                prefix="jellyfish"
                isOpen={openGroup === 'jellyfish'}
                onOpen={() => toggle('jellyfish')}
              />
            )}
            <ConfigSection
              title="water"
              accent={ac(0)}
              obj={cfg.water}
              prefix="water"
              isOpen={openGroup === 'water'}
              onOpen={() => toggle('water')}
            />
            {!isDark && (
              <ConfigSection
                title="clouds"
                accent={ac(2)}
                obj={cfg.clouds}
                prefix="clouds"
                isOpen={openGroup === 'clouds'}
                onOpen={() => toggle('clouds')}
              />
            )}
            {!isDark && (
              <ConfigSection
                title="cassettes"
                accent={ac(1)}
                obj={cfg.cassettes}
                prefix="cassettes"
                isOpen={openGroup === 'cassettes'}
                onOpen={() => toggle('cassettes')}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
