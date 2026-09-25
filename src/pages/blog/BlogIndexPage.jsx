import { Link } from 'react-router-dom'
import AsyncState from '@/components/AsyncState'
import StateMessage from '@/components/StateMessage'
import PageMeta from '@/components/PageMeta'
import PageFooter from '@/components/PageFooter'
import PaperCard from '@/components/PaperCard'
import { useBlogIndex } from '@/hooks/useBlogPost'
import { formatDate } from '@/lib/format'

export default function BlogIndexPage() {
  const { posts, status } = useBlogIndex()

  return (
    <div className="min-h-screen flex flex-col bg-paper relative text-ink font-body selection:bg-accent selection:text-white">
      <PageMeta
        title="Blog · Raphael El Mouallem"
        description="Write-ups on the systems and models I've built — from RAG platforms to a GPT-2 clone trained from scratch."
        path="/blog"
      />

      <AsyncState status={status}>
        <main className="flex-1 mx-auto px-6 sm:px-10 lg:px-16 py-[10vh]">
          <h1 className="font-display text-[clamp(2rem,4.5vw,2.75rem)] font-extrabold leading-tight text-ink mb-10">
            Blog
          </h1>

          {posts.length === 0 ? (
            <StateMessage mood="sleepy" title="Nothing here yet" message="Coming Very Soon." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} data-cursor="hover" className="no-underline">
                  <PaperCard className="transition-colors duration-150 hover:border-ink-faint">
                    <p className="font-body text-[0.78rem] tracking-[0.08em] uppercase text-ink-faint mb-2">
                      {formatDate(post.frontmatter.date)} · {post.readingTime.text}
                    </p>
                    <h2 className="font-display text-[1.3rem] font-semibold text-ink mb-2">
                      {post.frontmatter.title}
                    </h2>
                    <p className="font-body text-[0.92rem] leading-[1.7] text-ink-soft m-0">
                      {post.frontmatter.description}
                    </p>
                    {post.frontmatter.tags?.length > 0 && (
                      <p className="text-[0.78rem] text-ink-faint mt-4 mb-0">
                        {post.frontmatter.tags.map((t, i) => (
                          <span key={t}>
                            {i > 0 && <span className="mx-2">·</span>}
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                  </PaperCard>
                </Link>
              ))}
            </div>
          )}
        </main>

        <PageFooter />
      </AsyncState>
    </div>
  )
}
