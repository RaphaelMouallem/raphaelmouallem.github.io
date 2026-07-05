import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/ui/components/utils'

function generateWindArt() {
  const numLevels = 12 + Math.floor(Math.random() * 3)
  let dir = Math.random() > 0.5 ? 1 : -1

  const levels = Array.from({ length: numLevels }, () => ({
    N: 10 + Math.random() * 90,
    X: 2 + Math.floor(Math.random() * 6),
    R: 8 + Math.random() * 12,
    C: Math.random() < 0.2,
  }))

  let x = 0,
    y = 0
  let minX = 0,
    maxX = 0,
    maxY = 0
  const paths = []

  levels.forEach(({ N, X, R, C }) => {
    const x1 = x + dir * N
    paths.push({
      d: `M ${x.toFixed(2)} ${y.toFixed(2)} L ${x1.toFixed(2)} ${y.toFixed(2)}`,
      isAccent: C,
    })
    minX = Math.min(minX, x1)
    maxX = Math.max(maxX, x1)

    const sweep = dir === 1 ? 1 : 0
    let cx = x1 + dir * 1.2
    for (let i = 0; i < X; i++) {
      paths.push({
        d: `M ${cx.toFixed(2)} ${y.toFixed(2)} A ${R.toFixed(2)} ${R.toFixed(2)} 0 0 ${sweep} ${cx.toFixed(2)} ${(y + 2 * R).toFixed(2)}`,
        isAccent: C,
      })
      cx += dir * R * 1.4
      minX = Math.min(minX, cx)
      maxX = Math.max(maxX, cx)
    }

    x = cx
    y += R * 2.4
    maxY = Math.max(maxY, y)
    dir = -dir
  })

  const width = maxX - minX + 40
  const height = maxY + 40
  const offsetX = -minX + 20

  return { paths, width, height, offsetX }
}

function WindStreak({ top, left, width, flip, opacity = 0.3, delay = 0, strokeWidth = 1.5 }) {
  const artRef = useRef(null)
  if (!artRef.current) artRef.current = generateWindArt()
  const { paths, width: vw, height: vh, offsetX } = artRef.current

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
      initial={{ opacity: 0, x: flip ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.2, delay, ease: [0.25, 1, 0.25, 1] }}
    >
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <g transform={`translate(${offsetX}, 20)`}>
          {paths.map((pathObj, i) => (
            <path
              key={i}
              d={pathObj.d}
              fill="none"
              stroke={pathObj.isAccent ? 'var(--accent)' : 'var(--ink-faint)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={opacity}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  )
}

const streaks = [
  { top: '6%', left: '60%', width: '30%', opacity: 0.32, delay: 0.1 },
  { top: '18%', left: '-8%', width: '26%', opacity: 0.24, flip: true, delay: 0.15 },
  { top: '34%', left: '68%', width: '34%', opacity: 0.28, delay: 0.2 },
  { top: '48%', left: '8%', width: '24%', opacity: 0.2, flip: true, delay: 0.25 },
  { top: '62%', left: '58%', width: '28%', opacity: 0.22, delay: 0.2 },
  { top: '74%', left: '-6%', width: '30%', opacity: 0.18, flip: true, delay: 0.3 },
]

const mobileStreaks = [
  { top: '8%', left: '10%', width: '80%', opacity: 0.38, delay: 0.1, strokeWidth: 2.5 },
  {
    top: '28%',
    left: '15%',
    width: '70%',
    opacity: 0.32,
    delay: 0.15,
    strokeWidth: 2.5,
    flip: true,
  },
  { top: '52%', left: '50%', width: '80%', opacity: 0.3, delay: 0.2, strokeWidth: 2 },
  { top: '78%', left: '40%', width: '80%', opacity: 0.38, delay: 0.1, strokeWidth: 2.5 },
]

export default function WindField({ containerRef }) {
  const [height, setHeight] = useState(0)
  const mobile = useIsMobile()

  useEffect(() => {
    if (!containerRef?.current) return
    const el = containerRef.current
    const observer = new ResizeObserver(() => {
      setHeight(el.scrollHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {(mobile ? mobileStreaks : streaks).map((s, i) => (
        <WindStreak key={i} {...s} />
      ))}
    </div>
  )
}
