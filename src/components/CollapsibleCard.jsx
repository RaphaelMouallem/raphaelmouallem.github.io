import { motion, AnimatePresence } from 'framer-motion'
import { easeOut } from '@/styles/motion'

export default function CollapsibleCard({ mobile, title, glyph, open, onToggle, children }) {
  if (!mobile) {
    return (
      <>
        <h3 className={cardTagClass}>{title}</h3>
        {children}
      </>
    )
  }

  const panelId = `collapsible-panel-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="border-b border-border bg-paper-soft">
      <h3 className="m-0">
        <motion.button
          onClick={onToggle}
          className="flex items-center justify-between w-full bg-transparent border-none px-5 py-4 cursor-pointer font-[inherit] gap-3"
          data-cursor="hover"
          aria-expanded={open}
          aria-controls={panelId}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: easeOut }}
        >
          <span className="flex items-center gap-3.5">
            {glyph && (
              <span className="w-9 h-9 shrink-0 rounded-full border-[1.5px] border-accent flex items-center justify-center font-display text-[1.6rem] text-accent opacity-[0.85]">
                {glyph}
              </span>
            )}
            <span className={cardTagClass}>{title}</span>
          </span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-accent text-[1.3rem] leading-none shrink-0"
          >
            +
          </motion.span>
        </motion.button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-label={title}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const cardTagClass =
  'font-display text-base font-semibold tracking-[0.08em] uppercase text-ink m-0'
  