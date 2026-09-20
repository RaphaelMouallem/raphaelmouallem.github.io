import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { useMouseDrift } from '@/hooks/useMouseDrift'
import HeroLandscape from '@/assets/motifs/HeroLandscape'
import ScrollArrow from '@/assets/icons/ScrollArrow'
import { easeOut } from '@/styles/motion'
import ScrambleText from '@/components/ScrambleText'
import InkUnderline from '@/components/InkUnderline'
import { useState } from 'react'

export default function Hero() {
  const { intro } = useContent()
  const drift = useMouseDrift()
  const [nameSettled, setNameSettled] = useState(false)

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
      <motion.div
        className="absolute top-[-5%] left-[-8%] right-[-8%] bottom-[-5%] z-0"
        aria-hidden="true"
        animate={{ x: drift.x * 10, y: drift.y * 6 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <HeroLandscape drift={drift} />
      </motion.div>

      <div className="relative z-2 max-w-225 m-0 px-[5vw] w-full">
        <motion.p
          className="font-body text-[0.8rem] tracking-[0.15em] uppercase text-accent mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {intro.handle}
        </motion.p>
        <div className="h-3.5">
          {nameSettled && <InkUnderline delay={0.1} />}
        </div>

        <motion.h1
          className="font-display text-[clamp(3rem,9vw,6.5rem)] font-semibold mb-3 leading-[1.1] tracking-[-0.01em]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
        >
          <ScrambleText text={intro.name} onDone={() => setNameSettled(true)} />
        </motion.h1>

        <motion.p
          className="font-body text-[1.05rem] text-ink-soft mt-2 relative z-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
        >
          {intro.title}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-1"
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
