import { motion } from 'framer-motion'
import { easeOut } from '../motion'

export default function Section({ children, style, delay = 0, ...props }) {
  return (
    <motion.section
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
      {...props}
    >
      {children}
    </motion.section>
  )
}
