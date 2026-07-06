import { useState, useEffect } from 'react'
import { useIsMobile } from '@/ui/components/utils'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import Section from '../components/Section'
import PaperCard from '../components/PaperCard'
import { JAPANDI } from '../motion'
import CollapsibleCard from '../components/CollapsibleCard'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: JAPANDI },
}

export default function About() {
  const { about, pages } = useContent()
  const site = pages.about.site
  const mobile = useIsMobile()
  const [openCard, setOpenCard] = useState(null)
  const toggle = (id) => setOpenCard((cur) => (cur === id ? null : id))

  useEffect(() => {
    if (!mobile) setOpenCard(null)
  }, [mobile])

  return (
    <Section id="about" style={styles.section} data-cursor-label="about">
      <div style={{ ...styles.bioRow, ...(mobile ? styles.bioRowMobile : {}) }}>
        <span style={{ ...styles.eyebrow, ...(mobile ? styles.eyebrowMobile : {}) }}>About</span>
        <div style={{ ...(mobile ? styles.eyebrowSepH : styles.eyebrowSep) }} />
        <p style={styles.bio}>{about.bio}</p>
      </div>

      {mobile ? (
        <div style={styles.mobileStack}>
          <CollapsibleCard
            mobile={true}
            title="Education"
            glyph="学"
            open={openCard === 'education'}
            onToggle={() => toggle('education')}
          >
            <div style={styles.timeline}>
              {about.education.map((e, i) => (
                <div key={i} style={styles.timelineEntry}>
                  <div style={styles.timelineLeft}>
                    <div style={styles.timelineDot} />
                    {i < about.education.length - 1 && <div style={styles.timelineLine} />}
                  </div>
                  <div style={styles.timelineContent}>
                    <span style={styles.eduPeriod}>{e.period}</span>
                    <span style={styles.eduDegree}>{e.degree}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.cardDivider} />
            <p style={styles.langLabel}>Languages</p>
            <div style={styles.langList}>
              {about.spoken.map((s, i) => {
                const [lang, ...rest] = s.split(' — ')
                return (
                  <div key={i} style={styles.langRow}>
                    <span style={styles.langName}>{lang}</span>
                    <span style={styles.langLevel}>{rest.join(' — ')}</span>
                  </div>
                )
              })}
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            mobile={true}
            title="Skills"
            glyph="技"
            open={openCard === 'skills'}
            onToggle={() => toggle('skills')}
          >
            <div style={styles.skillsGrid}>
              {Object.entries(about.skills).map(([group, items]) => (
                <div key={group} style={styles.skillGroup}>
                  <span style={styles.skillGroupLabel}>{group}</span>
                  <div style={styles.pillRow}>
                    {items.map((item, i) => (
                      <span key={i} style={styles.pill}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            mobile={true}
            title="This Site"
            glyph="作"
            open={openCard === 'site'}
            onToggle={() => toggle('site')}
          >
            <p style={styles.siteText}>{site.description}</p>
            <div style={styles.pillRow}>
              {site.stack.map((s, i) => (
                <span key={i} style={styles.pill}>
                  {s}
                </span>
              ))}
            </div>
          </CollapsibleCard>
        </div>
      ) : (
        <motion.div
          style={styles.grid}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={item} style={styles.eduCol}>
            <PaperCard style={styles.cardRaw}>
              <CollapsibleCard mobile={false} title="Education">
                <div style={styles.timeline}>
                  {about.education.map((e, i) => (
                    <div key={i} style={styles.timelineEntry}>
                      <div style={styles.timelineLeft}>
                        <div style={styles.timelineDot} />
                        {i < about.education.length - 1 && <div style={styles.timelineLine} />}
                      </div>
                      <div style={styles.timelineContent}>
                        <span style={styles.eduPeriod}>{e.period}</span>
                        <span style={styles.eduDegree}>{e.degree}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.cardDivider} />
                <p style={styles.langLabel}>Languages</p>
                <div style={styles.langList}>
                  {about.spoken.map((s, i) => {
                    const [lang, ...rest] = s.split(' — ')
                    return (
                      <div key={i} style={styles.langRow}>
                        <span style={styles.langName}>{lang}</span>
                        <span style={styles.langLevel}>{rest.join(' — ')}</span>
                      </div>
                    )
                  })}
                </div>
              </CollapsibleCard>
            </PaperCard>
          </motion.div>

          <motion.div variants={item} style={styles.skillsCol}>
            <PaperCard style={styles.cardRaw}>
              <CollapsibleCard mobile={false} title="Skills">
                <div style={styles.skillsGrid}>
                  {Object.entries(about.skills).map(([group, items]) => (
                    <div key={group} style={styles.skillGroup}>
                      <span style={styles.skillGroupLabel}>{group}</span>
                      <div style={styles.pillRow}>
                        {items.map((item, i) => (
                          <span key={i} style={styles.pill}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            </PaperCard>
          </motion.div>

          <motion.div variants={item} style={{ gridColumn: '1 / -1' }}>
            <PaperCard style={styles.cardRaw}>
              <CollapsibleCard mobile={false} title="This Site">
                <div style={styles.siteInner}>
                  <div style={styles.siteTitleCol}>
                    <div style={styles.siteDisplayTitle}>
                      How it
                      <br />
                      was built
                    </div>
                  </div>
                  <div style={styles.siteBodyCol}>
                    <p style={styles.siteText}>{site.description}</p>
                    <div style={styles.pillRow}>
                      {site.stack.map((s, i) => (
                        <span key={i} style={styles.pill}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleCard>
            </PaperCard>
          </motion.div>
        </motion.div>
      )}
    </Section>
  )
}

const styles = {
  section: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '12vh 24px',
  },
  bioRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 48,
  },
  bioRowMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  eyebrow: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    fontWeight: 800,
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    flexShrink: 0,
    paddingTop: 4,
  },
  eyebrowMobile: {
    writingMode: 'horizontal-tb',
    transform: 'none',
    fontSize: '1.5rem',
    letterSpacing: '0.18em',
    paddingTop: 0,
  },
  eyebrowSep: {
    width: 1.5,
    alignSelf: 'stretch',
    background: 'var(--accent)',
    opacity: 0.4,
    flexShrink: 0,
  },
  eyebrowSepH: {
    height: 1,
    width: '100%',
    background: 'var(--accent)',
    opacity: 0.4,
  },
  bio: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.05rem',
    lineHeight: 1.85,
    color: 'var(--ink)',
    margin: 0,
    maxWidth: 680,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: 1,
    marginBottom: 1,
  },
  eduCol: { display: 'flex', flexDirection: 'column' },
  skillsCol: { display: 'flex', flexDirection: 'column' },
  cardRaw: {
    padding: '28px 28px',
    height: '100%',
    boxSizing: 'border-box',
  },
  eduPeriod: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    color: 'var(--accent)',
    letterSpacing: '0.06em',
  },
  eduDegree: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.92rem',
    color: 'var(--ink)',
    lineHeight: 1.4,
  },
  cardDivider: {
    height: 1,
    background: 'var(--border)',
    margin: '0 0 16px',
  },
  skillsGrid: {
    paddingTop: '1em',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  skillGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  skillGroupLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  pill: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.82rem',
    color: 'var(--ink-soft)',
    background: 'var(--paper)',
    border: '1px solid var(--border)',
    borderRadius: 2,
    padding: '3px 10px',
  },
  siteInner: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },
  siteTitleCol: {
    flexShrink: 0,
    width: 160,
  },
  siteDisplayTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'var(--accent)',
    margin: '8px 0 0',
    letterSpacing: '-0.01em',
  },
  siteBodyCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  siteText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    lineHeight: 1.75,
    color: 'var(--ink-soft)',
    margin: 0,
  },
  langList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  langRow: {
    display: 'flex',
    gap: 8,
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },
  langName: {
    color: 'var(--accent)',
    fontWeight: 500,
  },
  langLevel: {
    color: 'var(--ink-soft)',
  },
  langLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.68rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    margin: '0 0 16px',
  },
  mobileStack: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '1em',
  },
  timelineEntry: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    width: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    border: '1.5px solid var(--accent)',
    background: 'var(--paper-soft)',
    flexShrink: 0,
    marginTop: 4,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    background: 'var(--accent)',
    opacity: 0.2,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingBottom: 20,
  },
}
