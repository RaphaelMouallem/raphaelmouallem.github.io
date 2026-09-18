function wavePath(seed, width, baseY, amp, freq, points = 48) {
  let d = ''
  for (let i = 0; i <= points; i++) {
    const x = (width / points) * i
    const y =
      baseY + Math.sin(i * freq + seed) * amp + Math.sin(i * freq * 2.3 + seed * 1.7) * (amp * 0.35)
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`
  }
  return d
}

export default function ContourMotif({ lines = 6, accent = false, flip = false, style }) {
  const width = 1000
  const height = 160
  const baseY = height / 2

  const paths = Array.from({ length: lines }, (_, i) => {
    const offset = (i - (lines - 1) / 2) * 14
    const amp = 10 + (i % 3) * 4
    const freq = 0.18 + i * 0.015
    const seed = i * 1.3
    return wavePath(seed, width, baseY + offset, amp, freq)
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        transform: flip ? 'scaleX(-1)' : 'none',
        ...style,
      }}
    >
      {accent && (
        <circle cx={width * 0.84} cy={height * 0.28} r="8" fill="var(--accent)" opacity="0.8" />
      )}
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1"
          opacity={0.55 - i * 0.06}
        />
      ))}
    </svg>
  )
}
