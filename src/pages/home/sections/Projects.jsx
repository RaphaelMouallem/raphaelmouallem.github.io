import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import Section from '@/components/Section'
import { easeOut, JAPANDI } from '@/styles/motion'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: JAPANDI },
}

export default function Projects() {
  const { projects, sectionLabels, projectsUi } = useContent()
  const [openId, setOpenId] = useState(null)

  return (
    <Section id="projects" className="max-w-225 mx-auto py-[12vh] px-6" data-cursor-label="projects">
      <motion.div
        className="border border-border bg-paper-soft overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="bg-accent px-7 py-3.5">
          <h2 className="font-display text-2xl font-extrabold tracking-[0.12em] uppercase text-paper m-0">
            {sectionLabels.projects}
          </h2>
        </div>

        {projects.map((p, i) => {
          const isOpen = openId === p.id
          const panelId = `project-panel-${p.id}`
          return (
            <motion.div key={p.id} variants={rowVariants} className="border-b border-border">
              <motion.button
                onClick={() => setOpenId(isOpen ? null : p.id)}
                className="w-full flex items-center gap-6 px-7 py-5 bg-transparent border-none text-left font-[inherit]"
                aria-expanded={isOpen}
                aria-controls={panelId}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: easeOut }}
              >
                <span
                  className={`w-8.5 h-8.5 shrink-0 rounded-full border-[1.5px] border-accent flex items-center justify-center font-display text-[0.78rem] transition-colors duration-200 ease-[ease] ${
                    isOpen ? 'bg-accent text-paper' : 'text-accent'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 flex flex-col gap-1">
                  <span className="font-display text-[1.15rem] font-semibold text-ink">{p.title}</span>
                  <span className="font-body text-[0.85rem] text-ink-soft">{p.subtitle}</span>
                </span>
                <span data-cursor="hover" className="flex items-center justify-center w-8 h-8 rounded-full">
                  <motion.span
                    className="font-body text-[1.3rem] text-accent leading-none"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    +
                  </motion.span>
                </span>
              </motion.button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-label={p.title}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <div className="pt-0 pr-7 pb-7 pl-21.5">
                      <p className="font-body text-[0.95rem] leading-[1.75] text-ink-soft mb-4 max-w-170">
                        {p.description}
                      </p>
                      <p className="text-[0.85rem] text-ink-soft mb-4">
                        {p.tags.map((t, j) => (
                          <span key={j}>
                            {j > 0 && <span className="mx-2">·</span>}
                            {t}
                          </span>
                        ))}
                      </p>
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="hover"
                          className="font-body text-[0.9rem] text-accent no-underline border-b border-accent pb-0.5"
                        >
                          {projectsUi.viewOnGithub}
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
