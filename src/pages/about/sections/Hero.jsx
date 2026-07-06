import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { useMouseDrift } from '../hooks/useMouseDrift'
import HeroLandscape from '../assets/HeroLandscape'
import ScrollArrow from '../assets/ScrollArrow'
import { easeOut } from '../motion'
import ScrambleText from '../components/ScrambleText'
import InkUnderline from '../components/InkUnderline'
import { useState } from 'react'

export default function Hero() {
  const { intro } = useContent()
  const drift = useMouseDrift()
  const [nameSettled, setNameSettled] = useState(false)

  return (
    <section id="hero" style={styles.hero}>
      <motion.div
        style={styles.shapes}
        aria-hidden="true"
        animate={{ x: drift.x * 10, y: drift.y * 6 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <HeroLandscape drift={drift} />
      </motion.div>

      <div style={styles.content}>
        <motion.p
          style={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          raphaelmouallem.github.io
        </motion.p>
        <InkUnderline delay={nameSettled ? 0.1 : 999} />

        <motion.h1
          style={styles.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
        >
          <ScrambleText text={intro.name} onDone={() => setNameSettled(true)} />
        </motion.h1>

        <motion.p
          style={styles.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
        >
          {intro.title}
        </motion.p>
      </div>

      <motion.div
        style={styles.scrollIndicator}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.6 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
      >
        <ScrollArrow />
      </motion.div>
    </section>
  )
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 900,
    margin: '0',
    padding: '0 5vw',
    width: '100%',
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    margin: '0 0 12px',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 9vw, 6.5rem)',
    fontWeight: 600,
    margin: '0 0 12px',
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.05rem',
    color: 'var(--ink-soft)',
    margin: '8px 0 0',
    position: 'relative',
    zIndex: 2,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  shapes: {
    position: 'absolute',
    top: '-5%',
    left: '-8%',
    right: '-8%',
    bottom: '-5%',
    zIndex: 0,
  },
}
