import { motion } from 'framer-motion'

export default function InkUnderline({ width = 140, delay = 0 }) {
  return (
    <svg
      width={width}
      height="8"
      viewBox={`0 0 ${width} 8`}
      style={{ display: 'block', marginTop: 6 }}
    >
      <motion.path
        d={`M1 4 Q ${width / 2} 7 ${width - 1} 4`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.1, ease: [0.25, 1, 0.25, 1], delay }}
      />
    </svg>
  )
}