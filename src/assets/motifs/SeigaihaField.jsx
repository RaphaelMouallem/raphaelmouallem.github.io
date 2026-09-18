import { FAN_PATHS as TILE_PATHS } from './seigaihaMotif'

const TILE_W = 85
const TILE_H = 47
const META_COLS = 16
const META_ROWS = 20
const ACCENT_CHANCE = 0.25

const COL_STEP = TILE_W * 1.1
const ROW_STEP = TILE_H * 0.68

function buildCells() {
  const list = []
  for (let r = 0; r < META_ROWS; r++) {
    const offsetRow = r % 2 === 1
    const startCol = offsetRow ? -1 : 0
    for (let c = startCol; c < META_COLS; c++) {
      const x = c * COL_STEP + (offsetRow ? COL_STEP / 2 : 0)
      list.push({ x, y: r * ROW_STEP, accent: Math.random() < ACCENT_CHANCE })
    }
  }
  return list
}

const cells = buildCells()

export default function SeigaihaField() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <defs>
        <g id="seigaiha-tile">
          {TILE_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <pattern
          id="seigaiha-pattern"
          patternUnits="userSpaceOnUse"
          width={META_COLS * COL_STEP}
          height={META_ROWS * ROW_STEP}
        >
          {cells.map((t, i) => (
            <use
              key={i}
              href="#seigaiha-tile"
              x={t.x}
              y={t.y}
              fill={t.accent ? 'var(--accent)' : 'var(--ink-faint)'}
              opacity={t.accent ? 0.6 : 0.2}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha-pattern)" />
    </svg>
  )
}
