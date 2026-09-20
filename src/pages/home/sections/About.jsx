import { useState } from 'react'
import { useIsMobile } from '@/features/terminal-pet/utils'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import Section from '@/components/Section'
import PaperCard from '@/components/PaperCard'
import { JAPANDI } from '@/styles/motion'
import CollapsibleCard from '@/components/CollapsibleCard'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: JAPANDI },
}

const PILL = 'font-body text-[0.82rem] text-ink-soft bg-paper border border-border rounded-[2px] px-2.5 py-[3px]'
const EDU_PERIOD = 'font-body text-[0.75rem] text-accent tracking-[0.06em]'
const EDU_DEGREE = 'font-body text-[0.92rem] text-ink leading-[1.4]'
const SITE_TEXT = 'font-body text-[0.95rem] leading-[1.75] text-ink-soft m-0'
const TIMELINE_DOT = 'w-2 h-2 rounded-full border-[1.5px] border-accent bg-paper-soft'

const hAlignClass = (i, last) =>
  i === 0 ? 'items-start text-left' : i === last ? 'items-end text-right' : 'items-center text-center'

export default function About() {
  const { about, sectionLabels } = useContent()
  const { experience: L_EXP, education: L_EDU, skills: L_SKILLS, site: L_SITE, languages: L_LANG } =
    about.labels
  const mobile = useIsMobile()
  const [openCard, setOpenCard] = useState(null)
  const toggle = (id) => setOpenCard((cur) => (cur === id ? null : id))

  const [prevMobile, setPrevMobile] = useState(mobile)
  if (mobile !== prevMobile) {
    setPrevMobile(mobile)
    if (!mobile) setOpenCard(null)
  }

  return (
    <Section id="about" className="max-w-225 mx-auto py-[12vh] px-6" data-cursor-label="about">
      <div className={`flex items-start gap-2.5 mb-12 ${mobile ? 'flex-col gap-4' : 'flex-row'}`}>
        <h2
          className={`font-display text-2xl font-extrabold uppercase text-accent shrink-0 m-0 ${
            mobile
              ? '[writing-mode:horizontal-tb] tracking-[0.18em] pt-0'
              : '[writing-mode:vertical-rl] rotate-180 tracking-[0.12em] pt-1'
          }`}
        >
          {sectionLabels.about}
        </h2>
        <div
          className={
            mobile
              ? 'h-px w-full bg-accent opacity-40'
              : 'w-[1.5px] self-stretch bg-accent opacity-40 shrink-0'
          }
        />
        <p className="font-body text-[1.05rem] leading-[1.85] text-ink m-0 max-w-170">{about.bio}</p>
      </div>

      {mobile ? (
        <div className="flex flex-col border border-border overflow-hidden">
          <CollapsibleCard
            mobile={true}
            title={L_EXP}
            glyph="職"
            open={openCard === 'experience'}
            onToggle={() => toggle('experience')}
          >
            <div className="flex flex-col pt-[1em]">
              {about.experience.map((e, i) => (
                <div key={i} className="flex flex-row gap-4">
                  <div className="flex flex-col items-center shrink-0 w-3">
                    <div className={`${TIMELINE_DOT} shrink-0 mt-1`} />
                    {i < about.experience.length - 1 && (
                      <div className="w-px flex-1 bg-accent opacity-20 my-1" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-5">
                    <span className={EDU_PERIOD}>{e.period}</span>
                    <span className={EDU_DEGREE}>{e.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            mobile={true}
            title={L_EDU}
            glyph="学"
            open={openCard === 'education'}
            onToggle={() => toggle('education')}
          >
            <div className="flex flex-col pt-[1em]">
              {about.education.map((e, i) => (
                <div key={i} className="flex flex-row gap-4">
                  <div className="flex flex-col items-center shrink-0 w-3">
                    <div className={`${TIMELINE_DOT} shrink-0 mt-1`} />
                    {i < about.education.length - 1 && (
                      <div className="w-px flex-1 bg-accent opacity-20 my-1" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-5">
                    <span className={EDU_PERIOD}>{e.period}</span>
                    <span className={EDU_DEGREE}>{e.degree}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-border mb-4" />
            <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-soft mb-4">
              {L_LANG}
            </p>
            <div className="flex flex-col gap-1">
              {about.spoken.map((s, i) => {
                const [lang, ...rest] = s.split(' — ')
                return (
                  <div key={i} className="flex gap-2 text-[0.88rem] leading-[1.6]">
                    <span className="text-accent font-medium">{lang}</span>
                    <span className="text-ink-soft">{rest.join(' — ')}</span>
                  </div>
                )
              })}
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            mobile={true}
            title={L_SKILLS}
            glyph="技"
            open={openCard === 'skills'}
            onToggle={() => toggle('skills')}
          >
            <div className="pt-[1em] flex flex-col gap-3.5">
              {Object.entries(about.skills).map(([group, items]) => (
                <div key={group} className="flex flex-col gap-1.5">
                  <span className="font-body text-[0.65rem] tracking-[0.14em] uppercase text-accent">
                    {group}
                  </span>
                  <div className="flex flex-wrap gap-1.25">
                    {items.map((item, i) => (
                      <span key={i} className={PILL}>
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
            title={L_SITE}
            glyph="作"
            open={openCard === 'site'}
            onToggle={() => toggle('site')}
          >
            <p className={SITE_TEXT}>{about.description}</p>
            <div className="flex flex-wrap gap-1.25">
              {about.stack.map((s, i) => (
                <span key={i} className={PILL}>
                  {s}
                </span>
              ))}
            </div>
          </CollapsibleCard>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-[1fr_1.6fr] gap-px mb-px"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={item} className="col-span-full">
            <PaperCard className="h-full">
              <CollapsibleCard mobile={false} title={L_EXP}>
                <div className="pt-[0.5em]">
                  <div className="relative flex justify-between items-center h-2">
                    <div className="absolute left-1 right-1 top-1/2 h-px bg-accent opacity-20 -translate-y-1/2" />
                    {about.experience.map((e, i) => (
                      <div key={i} className={`${TIMELINE_DOT} relative z-1`} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2.5 gap-3">
                    {about.experience.map((e, i) => {
                      const last = about.experience.length - 1
                      return (
                        <div
                          key={i}
                          className={`flex flex-col gap-0.5 max-w-[45%] ${hAlignClass(i, last)}`}
                        >
                          <span className={EDU_PERIOD}>{e.period}</span>
                          <span className={EDU_DEGREE}>{e.role}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CollapsibleCard>
            </PaperCard>
          </motion.div>

          <motion.div variants={item} className="flex flex-col">
            <PaperCard className="h-full">
              <CollapsibleCard mobile={false} title={L_EDU}>
                <div className="flex flex-col pt-[1em]">
                  {about.education.map((e, i) => (
                    <div key={i} className="flex flex-row gap-4">
                      <div className="flex flex-col items-center shrink-0 w-3">
                        <div className={`${TIMELINE_DOT} shrink-0 mt-1`} />
                        {i < about.education.length - 1 && (
                          <div className="w-px flex-1 bg-accent opacity-20 my-1" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 pb-5">
                        <span className={EDU_PERIOD}>{e.period}</span>
                        <span className={EDU_DEGREE}>{e.degree}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border mb-4" />
                <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-soft mb-4">
                  {L_LANG}
                </p>
                <div className="flex flex-col gap-1">
                  {about.spoken.map((s, i) => {
                    const [lang, ...rest] = s.split(' — ')
                    return (
                      <div key={i} className="flex gap-2 text-[0.88rem] leading-[1.6]">
                        <span className="text-accent font-medium">{lang}</span>
                        <span className="text-ink-soft">{rest.join(' — ')}</span>
                      </div>
                    )
                  })}
                </div>
              </CollapsibleCard>
            </PaperCard>
          </motion.div>

          <motion.div variants={item} className="flex flex-col">
            <PaperCard className="h-full">
              <CollapsibleCard mobile={false} title={L_SKILLS}>
                <div className="pt-[1em] flex flex-col gap-3.5">
                  {Object.entries(about.skills).map(([group, items]) => (
                    <div key={group} className="flex flex-col gap-1.5">
                      <span className="font-body text-[0.65rem] tracking-[0.14em] uppercase text-accent">
                        {group}
                      </span>
                      <div className="flex flex-wrap gap-1.25">
                        {items.map((item, i) => (
                          <span key={i} className={PILL}>
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

          <motion.div variants={item} className="col-span-full">
            <PaperCard className="h-full">
              <CollapsibleCard mobile={false} title={L_SITE}>
                <div className="flex flex-row gap-10 items-start">
                  <div className="shrink-0 w-40">
                    <div className="font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-[1.2] text-accent mt-2 tracking-[-0.01em]">
                      {about.siteHeading[0]}
                      <br />
                      {about.siteHeading[1]}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <p className={SITE_TEXT}>{about.description}</p>
                    <div className="flex flex-wrap gap-1.25">
                      {about.stack.map((s, i) => (
                        <span key={i} className={PILL}>
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
