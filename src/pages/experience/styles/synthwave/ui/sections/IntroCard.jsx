import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { ac, Eyebrow, MONO } from '@/pages/experience/styles/synthwave/ui/kit'

function Typewriter({ text, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setTyping(true)
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setTyping(false)
        onDone?.()
      }
    }, 55)
    return () => clearInterval(id)
  }, [text])

  return (
    <span>
      {displayed}
      <span
        style={{
          color: '#fff',
          opacity: 1,
          animation: typing ? 'none' : 'blink 1s step-end infinite',
          display: 'inline-block',
        }}
      >
        █
      </span>
    </span>
  )
}

export default function IntroCard({ visible }) {
  const { intro } = useContent()
  const [done, setDone] = useState(false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 12,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Eyebrow color={ac(0)}>whoami</Eyebrow>
          <h1
            style={{
              fontFamily: MONO,
              fontSize: 'clamp(22px, 4vw, 42px)',
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}
          >
            <Typewriter text={intro.name} onDone={() => setDone(true)} />
          </h1>
          <AnimatePresence>
            {done && (
              <motion.p
                key="sub"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: MONO,
                  fontSize: 'clamp(10px, 1.5vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                }}
              >
                {intro.title}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {done && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 1.2, delay: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: ac(1),
                  margin: '16px 0 0',
                  letterSpacing: '0.15em',
                }}
              >
                {intro.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
