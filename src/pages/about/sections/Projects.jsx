import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import Section from '../components/Section'
import { easeOut, JAPANDI } from '../motion'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: JAPANDI },
}

export default function Projects() {
  const { projects } = useContent()
  const [openId, setOpenId] = useState(null)

  return (
    <Section id="projects" style={styles.section} data-cursor-label="projects">
      <motion.div
        style={styles.frame}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div style={styles.tableHeader}>
          <span style={styles.tableHeaderText}>Projects</span>
        </div>

        {projects.map((p, i) => {
          const isOpen = openId === p.id
          return (
            <motion.div key={p.id} variants={rowVariants} style={styles.row}>
              <button onClick={() => setOpenId(isOpen ? null : p.id)} style={styles.header}>
                <span style={{ ...styles.stamp, ...(isOpen ? styles.stampOpen : {}) }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={styles.titleGroup}>
                  <span style={styles.title}>{p.title}</span>
                  <span style={styles.subtitle}>{p.subtitle}</span>
                </span>
                <span data-cursor="hover" style={styles.chevronWrap}>
                  <motion.span
                    style={styles.chevron}
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    +
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    style={styles.bodyWrap}
                  >
                    <div style={styles.body}>
                      <p style={styles.description}>{p.description}</p>
                      <p style={styles.tags}>
                        {p.tags.map((t, j) => (
                          <span key={j}>
                            {j > 0 && <span style={styles.sep}>·</span>}
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
                          style={styles.link}
                        >
                          View on GitHub →
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

const styles = {
  section: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '12vh 24px',
  },
  frame: {
    border: '1px solid var(--border)',
    background: 'var(--paper-soft)',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'var(--accent)',
    padding: '14px 28px',
  },
  tableHeaderText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--paper)',
  },
  row: {
    borderBottom: '1px solid var(--border)',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    padding: '20px 28px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  stamp: {
    width: 34,
    height: 34,
    flexShrink: 0,
    borderRadius: '50%',
    border: '1.5px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: '0.78rem',
    color: 'var(--accent)',
    transition: 'background-color 200ms ease, color 200ms ease',
  },
  stampOpen: {
    backgroundColor: 'var(--accent)',
    color: 'var(--paper)',
  },
  titleGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
  },
  chevronWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
  },
  chevron: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.3rem',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  bodyWrap: {
    overflow: 'hidden',
  },
  body: {
    padding: '0 28px 28px 86px',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    lineHeight: 1.75,
    color: 'var(--ink-soft)',
    margin: '0 0 16px',
    maxWidth: 680,
  },
  tags: {
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
    margin: '0 0 16px',
  },
  sep: {
    margin: '0 8px',
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--accent)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--accent)',
    paddingBottom: 2,
  },
}
