import { m } from 'framer-motion'
import { easeOut } from '@/styles/motion'

export default function HamburgerIcon({ open }) {
  const bar = 'absolute left-0 w-5 h-[1.5px] rounded-full bg-[var(--ink)]'
  return (
    <span className="relative block w-5 h-5">
      <m.span
        className={bar}
        animate={open ? { y: 9, rotate: 45 } : { y: 6, rotate: 0 }}
        transition={{ duration: 0.2, ease: easeOut }}
      />
      <m.span
        className={bar}
        animate={open ? { y: 9, rotate: -45 } : { y: 13, rotate: 0 }}
        transition={{ duration: 0.2, ease: easeOut }}
      />
    </span>
  )
}
