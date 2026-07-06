import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÀÉÎÕÜ'.split('')
const STEPS_PER_CHAR = 3
const STEP_INTERVAL = 55
const CHAR_STAGGER = 50

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

export default function ScrambleText({ text, onDone, style }) {
  const [display, setDisplay] = useState(() =>
    text.split('').map((c) => (c === ' ' ? ' ' : randomChar()))
  )
  const timers = useRef([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const chars = text.split('')

    chars.forEach((finalChar, i) => {
      if (finalChar === ' ') return
      const startDelay = i * CHAR_STAGGER
      for (let step = 0; step < STEPS_PER_CHAR; step++) {
        const t = setTimeout(
          () => {
            setDisplay((prev) => {
              const next = [...prev]
              next[i] = step === STEPS_PER_CHAR - 1 ? finalChar : randomChar()
              return next
            })
            if (step === STEPS_PER_CHAR - 1 && i === chars.length - 1) {
              onDone?.()
            }
          },
          startDelay + step * STEP_INTERVAL
        )
        timers.current.push(t)
      }
    })

    return () => timers.current.forEach(clearTimeout)
  }, [text])

  return <span style={style}>{display.join('')}</span>
}