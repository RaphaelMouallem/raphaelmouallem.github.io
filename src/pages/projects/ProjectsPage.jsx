import PageMeta from '@/shared/layout/PageMeta'
import PageFooter from '@/shared/layout/PageFooter'
import PaperCard from '@/shared/ui/PaperCard'
import StateMessage from '@/shared/state/StateMessage'
import { useContent } from '@/shared/hooks/useContent'
import ApertureBadge from './components/ApertureBadge'

export default function ProjectsPage() {
  const { projects, projectsUi } = useContent()

  return (
    <div className="min-h-screen flex flex-col bg-paper relative text-ink font-body selection:bg-accent selection:text-white">
      <PageMeta
        title="Projects · Raphael El Mouallem"
        description="Projects spanning RAG platforms, a GPT-2 clone trained from scratch, and other systems-meets-AI work."
        path="/projects"
      />

      <main className="flex-1 mx-auto px-6 sm:px-10 lg:px-16 py-[10vh]">
        <h1 className="font-display text-[clamp(2rem,4.5vw,2.75rem)] font-extrabold leading-tight text-ink mb-10">
          Projects
        </h1>

        {projects.length === 0 ? (
          <StateMessage mood="sleepy" title="Nothing here yet" message="Check back soon." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <PaperCard key={p.id} className="group flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <ApertureBadge index={i} />
                  <div className="flex flex-col gap-0.5">
                    <h2 className="font-display text-[1.15rem] font-semibold text-ink m-0">{p.title}</h2>
                    <p className="font-body text-[0.85rem] text-ink-soft m-0">{p.subtitle}</p>
                  </div>
                </div>

                <p className="font-body text-[0.9rem] leading-[1.7] text-ink-soft m-0">{p.description}</p>

                <p className="flex flex-wrap gap-x-2 gap-y-1 text-[0.8rem] text-ink-faint m-0">
                  {p.tags.map((t, j) => (
                    <span key={t} className="inline-flex items-center gap-2">
                      {j > 0 && <span aria-hidden="true">·</span>}
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
                    className="self-start font-body text-[0.85rem] text-accent no-underline border-b border-accent pb-0.5"
                  >
                    {projectsUi.viewOnGithub}
                  </a>
                )}
              </PaperCard>
            ))}
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  )
}
