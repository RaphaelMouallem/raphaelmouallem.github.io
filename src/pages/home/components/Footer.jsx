import { Link } from 'react-router-dom'
import { useContent } from '@/shared/hooks/useContent'
import Section from '@/shared/ui/Section'
import SeigaihaField from '@/shared/motifs/SeigaihaField'
import GithubIcon from '@/shared/icons/GithubIcon'
import LinkedinIcon from '@/shared/icons/LinkedinIcon'
import { useIsMobile } from '@/shared/hooks/useIsMobile'

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

const FOOTER_LINK =
  'text-ink-soft no-underline inline-block rounded-full px-2.5 w-fit [transition:color_0.2s_ease,transform_150ms_cubic-bezier(0.16,1,0.3,1)] hover:text-ink active:scale-[0.97]'

export default function Footer() {
  const { footer } = useContent()
  const footerBottom = useIsMobile(641)

  return (
    <div className="relative">
      <SeigaihaField />
      <Section id="footer" className="mx-auto pt-[8vh] px-[9vh] pb-[5vh]">
        <div className="mb-5">
          <h2 className="font-display text-[1.8rem] font-extrabold mb-2 uppercase text-accent">
            {footer.heading}
          </h2>
          <p className="font-body text-[0.95rem] text-ink-soft m-0">{footer.subheading}</p>
        </div>

        <div className="flex flex-wrap gap-16 mb-12">
          <div className="flex flex-col gap-2.5">
            <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-accent mb-1">
              {footer.sectionsLabel}
            </p>
            {footer.sections.map((l) => (
              <a key={l.label} href={l.href} data-cursor="hover" className={FOOTER_LINK}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-accent mb-1">
              {footer.pagesLabel}
            </p>
            {footer.pages.map((l) => (
              <Link key={l.label} to={l.href} data-cursor="hover" className={FOOTER_LINK}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-accent mb-1">
              {footer.connectLabel}
            </p>
            {footer.social.map((l) => {
              const Icon = SOCIAL_ICONS[l.label.toLowerCase()]
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className={`inline-flex items-center gap-2 ${FOOTER_LINK}`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-accent" />}
                  {l.label}
                </a>
              )
            })}
          </div>
        </div>

        <div
          className={`flex gap-4 pt-6 border-t border-ink-faint ${
            footerBottom
              ? 'flex-col items-center justify-center text-center'
              : 'flex-row items-start justify-between text-left'
          }`}
        >
          <p className="font-body text-[0.8rem] text-ink-soft m-0">{footer.footer}</p>
          <span className="w-11.5 h-11.5 shrink-0 border-[1.5px] border-accent rounded text-accent bg-accent-soft font-display text-[0.85rem] font-medium flex items-center justify-center [writing-mode:vertical-rl] -rotate-6 leading-none">
            RM
          </span>
        </div>
      </Section>
    </div>
  )
}
