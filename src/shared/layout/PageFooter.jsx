import { useContent } from '@/shared/hooks/useContent'
import SeigaihaField from '@/shared/motifs/SeigaihaField'
import GithubIcon from '@/shared/icons/GithubIcon'
import LinkedinIcon from '@/shared/icons/LinkedinIcon'

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

const LINK = 'text-ink-soft no-underline hover:text-ink transition-colors duration-150'

export default function PageFooter() {
  const { footer } = useContent()

  return (
    <footer className="relative mt-16 overflow-hidden">
      <SeigaihaField />
      <div className="relative max-w-260 mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-[0.8rem] text-ink-faint m-0">{footer.footer}</p>
        <nav className="flex items-center gap-5">
          {footer.social.map((l) => {
            const Icon = SOCIAL_ICONS[l.label.toLowerCase()]
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className={`inline-flex items-center gap-2 ${LINK}`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0 text-accent" />}
                {l.label}
              </a>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
