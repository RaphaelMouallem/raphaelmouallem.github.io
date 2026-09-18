import { motion } from 'framer-motion'

function hash(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

const SEED = Math.random() * 10000

const RADII = [11, 12, 13]
const COL_STEP = 20
const ROW_STEP = 17
const MOON_CX = 820
const MOON_CY = 380
const MOON_R = 110
const CRATERS = []
{
  let row = 0
  for (let y = MOON_CY - MOON_R; y <= MOON_CY + MOON_R; y += ROW_STEP) {
    const offset = row % 2 === 0 ? 0 : COL_STEP / 2
    for (let x = MOON_CX - MOON_R + offset; x <= MOON_CX + MOON_R; x += COL_STEP) {
      if (hash(x + SEED, y + SEED) < 0.4) continue
 
      const roll = hash(x + SEED + 5, y + SEED + 5)
      const variant = roll < 0.3 ? 'star' : roll < 0.45 ? 'stripe' : 'plain'
      const r = RADII[Math.floor(hash(x + SEED + 3, y + SEED + 3) * RADII.length)]
      const opacity = 0.5 + hash(x + SEED + 9, y + SEED + 9) * 0.5
      CRATERS.push({ x, y, r, variant, opacity })
    }
    row++
  }
}

const STAR_PATH = 'M0,-4 L0.9,-0.9 L4,0 L0.9,0.9 L0,4 L-0.9,0.9 L-4,0 L-0.9,-0.9 Z'

const STRIPE_PATH = 'M1.1,1.1 L3,3 M-1.1,1.1 L-3,3 M1.1,-1.1 L3,-3 M-1.1,-1.1 L-3,-3'

const SUN_CX = 820
const SUN_CY = 430
const SUN_R = 190

export default function HeroLandscape({ drift }) {
  return (
    <svg
      style={{ width: '100%', height: '100%', display: 'block' }}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="moon-clip">
          <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R} />
        </clipPath>
      </defs>

      <path
        d="M-100,750 L-100,460 Q120,375 320,440 Q520,345 760,440 Q960,355 1300,450 L1300,750 Z"
        fill="#cdbda7"
        style={{ filter: 'drop-shadow(0 -14px 26px var(--shadow))' }}
      />
      <path
        d="M-100,462 Q120,377 320,442 Q520,346 760,442 Q960,357 1300,452"
        fill="none"
        stroke="#e3d6c4"
        strokeWidth="3"
        opacity="0.7"
      />

      <motion.g
        animate={{ x: drift.x * -20, y: drift.y * -16 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <g className="celestial-sun">
          <circle
            cx={SUN_CX}
            cy={SUN_CY}
            r={SUN_R}
            fill="var(--accent)"
            style={{ filter: 'drop-shadow(0 18px 34px var(--shadow))' }}
          />
          <circle
            cx={SUN_CX}
            cy={SUN_CY}
            r={SUN_R}
            fill="none"
            stroke="var(--paper)"
            strokeWidth="2"
            opacity="0.25"
          />
        </g>

        <g className="celestial-moon">
          <circle
            cx={MOON_CX}
            cy={MOON_CY}
            r={MOON_R}
            fill="#efd989"
            style={{ filter: 'drop-shadow(0 14px 30px rgba(240, 216, 120, 0.35))' }}
          />
          <g clipPath="url(#moon-clip)">
            {CRATERS.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={c.r}
                  fill="none"
                  stroke="var(--paper)"
                  strokeWidth="1.3"
                  opacity={0.28 * c.opacity}
                />
                {c.variant === 'star' && (
                  <path
                    d={STAR_PATH}
                    transform={`translate(${c.x} ${c.y})`}
                    fill="var(--paper)"
                    opacity={0.4 * c.opacity}
                  />
                )}
                {c.variant === 'stripe' && (
                  <path
                    d={STRIPE_PATH}
                    transform={`translate(${c.x} ${c.y})`}
                    fill="none"
                    stroke="var(--paper)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    opacity={0.4 * c.opacity}
                  />
                )}
              </g>
            ))}
          </g>
          <circle
            cx={MOON_CX}
            cy={MOON_CY}
            r={MOON_R}
            fill="none"
            stroke="var(--paper)"
            strokeWidth="2"
            opacity="0.25"
          />
        </g>
      </motion.g>

      <path
        d="M-100,750 L-100,520 Q200,438 460,520 Q740,428 1020,520 Q1140,478 1300,520 L1300,750 Z"
        fill="#a8907a"
        style={{ filter: 'drop-shadow(0 -14px 28px var(--shadow))' }}
      />
      <path
        d="M-100,522 Q200,440 460,522 Q740,430 1020,522 Q1140,480 1300,522"
        fill="none"
        stroke="#c4ad94"
        strokeWidth="3"
        opacity="0.7"
      />

      <path
        d="M-100,750 L-100,600 Q260,518 560,600 Q840,508 1130,600 L1300,600 L1300,750 Z"
        fill="var(--paper)"
        style={{ filter: 'drop-shadow(0 -10px 22px var(--shadow))' }}
      />
    </svg>
  )
}
