import { useEffect, useState } from 'react'
import StatePet from './StatePet'
import ScrambleText from '../ui/ScrambleText'

const WORDS = ['loading', 'fetching', 'thinking']

export default function LoadingState() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((n) => n + 1), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center gap-5">
      <StatePet mood="loading" />
      <ScrambleText
        text={WORDS[index % WORDS.length]}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--ink-soft)',
          letterSpacing: '0.02em',
        }}
      />
    </div>
  )
}