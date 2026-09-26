import { useEffect, useRef } from 'react'

export const WATER_LINE_VH = 76

const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'Σ', 'β', 'θ', 'ω', 'Ψ', 'φ', 'α', 'Δ', '∫', '√',
  '≠', '≈', '≤', '≥', '÷', '∂', 'Π', 'γ', '×',
]

const FONT_SIZE = 18
const LINE_HEIGHT = 22
const COLUMN_WIDTH = 40
const MAX_ACTIVE_RATIO = 1
const SPRINT_MIN_LEN = 3
const SPRINT_MAX_LEN = 17
const SPEED_TIERS = [90, 115, 145]
const SPAWN_CHANCE_PER_SEC = 4
const HEAD_ALPHA = 0.85
const TAIL_FALLOFF = 0.72
const RIPPLE_BURST_COUNT = 4
const RIPPLE_STAGGER_MS = 220
const RIPPLE_DURATION_MS = 900

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export default function CharacterRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let waterY = 0
    let columns = 0
    let sprints = []
    let ripples = []
    let occupiedColumns = new Set()
    let colors = { accent: '#c8492f' }
    let lastTime = performance.now()
    let animationId = null

    function readColors() {
      const style = getComputedStyle(document.documentElement)
      colors = {
        accent: style.getPropertyValue('--accent').trim() || colors.accent,
      }
    }

    function spawnSprintAt(col, { force = false, headY } = {}) {
      if (col < 0 || col >= columns) return
      if (occupiedColumns.has(col)) {
        if (!force) return
        sprints = sprints.filter((s) => s.col !== col)
      }

      const length = SPRINT_MIN_LEN + Math.floor(Math.random() * (SPRINT_MAX_LEN - SPRINT_MIN_LEN))
      sprints.push({
        col,
        x: col * COLUMN_WIDTH + COLUMN_WIDTH / 2,
        headY: headY ?? -length * LINE_HEIGHT,
        length,
        chars: Array.from({ length }, randomChar),
        speed: SPEED_TIERS[Math.floor(Math.random() * SPEED_TIERS.length)],
        charSwapAt: 0,
        rippled: false,
      })
      occupiedColumns.add(col)
    }

    function spawnSprint() {
      const maxActive = Math.max(1, Math.floor(columns * MAX_ACTIVE_RATIO))
      if (occupiedColumns.size >= maxActive) return

      let col = Math.floor(Math.random() * columns)
      let attempts = 0
      while (occupiedColumns.has(col) && attempts < 5) {
        col = Math.floor(Math.random() * columns)
        attempts++
      }
      spawnSprintAt(col)
    }

    function seedInitialSprints() {
      const maxActive = Math.max(1, Math.floor(columns * MAX_ACTIVE_RATIO))
      const order = Array.from({ length: columns }, (_, i) => i)
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
      }
      order.slice(0, maxActive).forEach((col) => {
        spawnSprintAt(col, { headY: Math.random() * waterY })
      })
    }

    function resize() {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      waterY = (WATER_LINE_VH / 100) * height
      columns = Math.max(25, Math.floor(width / COLUMN_WIDTH))
      ctx.font = `bold ${FONT_SIZE}px monospace`
      ctx.textAlign = 'center'
      sprints = []
      ripples = []
      occupiedColumns = new Set()
      seedInitialSprints()
    }

    function drawWaterLine(time) {
      ctx.save()
      ctx.strokeStyle = colors.accent
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 1.2
      ctx.beginPath()
      const step = 24
      for (let x = 0; x <= width; x += step) {
        const y = waterY + Math.sin(x * 0.02 + time * 0.0006) * 3
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()
    }

    function stepRipples(dtMs) {
      ripples.forEach((r) => {
        r.age += dtMs
      })
      ripples = ripples.filter((r) => r.age < r.duration)

      ripples.forEach((r) => {
        if (r.age < 0) return
        const t = r.age / r.duration
        const radiusX = 6 + t * 46
        const radiusY = radiusX * 0.28
        ctx.save()
        ctx.globalAlpha = (1 - t) * 0.4
        ctx.strokeStyle = colors.accent
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(r.x, r.y, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      })
    }

    function spawnRippleBurst(x) {
      for (let i = 0; i < RIPPLE_BURST_COUNT; i++) {
        ripples.push({ x, y: waterY, age: -i * RIPPLE_STAGGER_MS, duration: RIPPLE_DURATION_MS })
      }
    }

    function stepSprints(dt, time) {
      sprints.forEach((s) => {
        s.headY += s.speed * dt

        if (time > s.charSwapAt) {
          const idx = Math.floor(Math.random() * s.chars.length)
          s.chars[idx] = randomChar()
          s.charSwapAt = time + 200 + Math.random() * 300
        }

        if (!s.rippled && s.headY >= waterY) {
          spawnRippleBurst(s.x)
          s.rippled = true
        }
      })

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, width, waterY)
      ctx.clip()

      sprints.forEach((s) => {
        for (let i = 0; i < s.length; i++) {
          const y = s.headY - i * LINE_HEIGHT
          if (y < -LINE_HEIGHT || y > waterY) continue
          ctx.globalAlpha = HEAD_ALPHA * Math.pow(TAIL_FALLOFF, i)
          ctx.fillStyle = colors.accent
          ctx.fillText(s.chars[i], s.x, y)
        }
      })

      ctx.restore()

      sprints = sprints.filter((s) => {
        const tailY = s.headY - (s.length - 1) * LINE_HEIGHT
        const alive = tailY < waterY
        if (!alive) occupiedColumns.delete(s.col)
        return alive
      })
    }

    function frame(time) {
      const dt = Math.min(0.05, (time - lastTime) / 1000)
      lastTime = time

      ctx.clearRect(0, 0, width, height)

      if (Math.random() < SPAWN_CHANCE_PER_SEC * dt) spawnSprint()

      stepSprints(dt, time)
      stepRipples(dt * 1000)
      drawWaterLine(time)

      animationId = requestAnimationFrame(frame)
    }

    readColors()
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    function handleMouseDown(e) {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const centerCol = Math.floor(clickX / COLUMN_WIDTH)
      spawnSprintAt(centerCol - 1, { force: true })
      spawnSprintAt(centerCol, { force: true })
      spawnSprintAt(centerCol + 1, { force: true })
    }
    canvas.addEventListener('mousedown', handleMouseDown)

    const themeObserver = new MutationObserver(readColors)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (prefersReducedMotion) {
      drawWaterLine(0)
    } else {
      animationId = requestAnimationFrame(frame)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousedown', handleMouseDown)
      resizeObserver.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}