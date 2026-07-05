import { motion } from 'framer-motion'

export default function HeroLandscape({ drift }) {
  return (
    <svg
      style={{ width: '100%', height: '100%', display: 'block' }}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
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
        <circle
          cx="820"
          cy="430"
          r="190"
          fill="var(--accent)"
          style={{ filter: 'drop-shadow(0 18px 34px var(--shadow))' }}
        />
        <circle
          cx="820"
          cy="430"
          r="190"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="2"
          opacity="0.25"
        />
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
