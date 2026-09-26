import { useState } from 'react'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { m } from 'framer-motion'
import { useContent } from '@/shared/hooks/useContent'
import Section from '@/shared/ui/Section'
import PaperCard from '@/shared/ui/PaperCard'
import { JAPANDI } from '@/styles/motion'
import CollapsibleCard from '@/shared/ui/CollapsibleCard'
import ExperienceBlock from './about/ExperienceBlock'
import EducationBlock from './about/EducationBlock'
import SkillsBlock from './about/SkillsBlock'
import SiteBlock from './about/SiteBlock'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: JAPANDI },
}

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

  const cards = [
    { id: 'experience', title: L_EXP, glyph: '職', content: <ExperienceBlock experience={about.experience} mobile={mobile} /> },
    {
      id: 'education',
      title: L_EDU,
      glyph: '学',
      content: <EducationBlock education={about.education} spoken={about.spoken} langLabel={L_LANG} />,
    },
    { id: 'skills', title: L_SKILLS, glyph: '技', content: <SkillsBlock skills={about.skills} /> },
    {
      id: 'site',
      title: L_SITE,
      glyph: '作',
      content: (
        <SiteBlock
          description={about.description}
          stack={about.stack}
          siteHeading={about.siteHeading}
          mobile={mobile}
        />
      ),
    },
  ]

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
          className={mobile ? 'h-px w-full bg-accent opacity-40' : 'w-[1.5px] self-stretch bg-accent opacity-40 shrink-0'}
        />
        <p className="font-body text-[1.05rem] leading-[1.85] text-ink m-0 max-w-170">{about.bio}</p>
      </div>

      {mobile ? (
        <div className="flex flex-col border border-border overflow-hidden">
          {cards.map((c) => (
            <CollapsibleCard
              key={c.id}
              mobile
              title={c.title}
              glyph={c.glyph}
              open={openCard === c.id}
              onToggle={() => toggle(c.id)}
            >
              {c.content}
            </CollapsibleCard>
          ))}
        </div>
      ) : (
        <m.div
          className="grid grid-cols-[1fr_1.6fr] gap-px mb-px"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {cards.map((c, i) => (
            <m.div key={c.id} variants={item} className={i === 0 || i === 3 ? 'col-span-full' : 'flex flex-col'}>
              <PaperCard className="h-full">
                <CollapsibleCard title={c.title}>{c.content}</CollapsibleCard>
              </PaperCard>
            </m.div>
          ))}
        </m.div>
      )}
    </Section>
  )
}
