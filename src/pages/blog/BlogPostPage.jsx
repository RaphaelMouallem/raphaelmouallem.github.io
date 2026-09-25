import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import '@/styles/tokens.css'
import '@/styles/blog.css'
import 'katex/dist/katex.min.css'
import AsyncState from '@/components/AsyncState'
import StateMessage from '@/components/StateMessage'
import PageMeta, { SITE_URL } from '@/components/PageMeta'
import TableOfContents from './components/TableOfContents'
import PageFooter from '@/components/PageFooter'
import { useBlogPost } from '@/hooks/useBlogPost'
import { formatDate } from '@/lib/format'
import { enhanceCodeBlocks } from '@/lib/enhanceCodeBlocks'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { post, status } = useBlogPost(slug)
  const proseRef = useRef(null)

  const jsonLd = useMemo(() => {
    if (!post) return null
    const url = `${SITE_URL}/blog/${slug}`
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontmatter.title,
      description: post.frontmatter.description,
      datePublished: post.frontmatter.date,
      url,
      mainEntityOfPage: url,
      ...(post.frontmatter.cover && {
        image: `${SITE_URL}/blog/${slug}/${post.frontmatter.cover}`,
      }),
      ...(post.frontmatter.tags?.length && { keywords: post.frontmatter.tags.join(', ') }),
      author: { '@type': 'Person', name: 'Raphael El Mouallem', url: SITE_URL },
    }
  }, [post, slug])

  useEffect(() => {
    if (!post?.html) return
    return enhanceCodeBlocks(proseRef.current)
  }, [post?.html])

  return (
    <div className="about-page min-h-screen bg-paper relative text-ink font-body selection:bg-accent selection:text-white">
      <AsyncState
        status={status}
        notFound={
          <StateMessage
            mood="surprised"
            title={`No post at "${slug}".`}
            action={
              <Link to="/blog" data-cursor="hover" className="text-accent underline underline-offset-2">
                Back to the blog
              </Link>
            }
          />
        }
        error={<StateMessage mood="dead" title="Couldn't load this post." message="Try refreshing." />}
      >
        {post && (
          <>
            <PageMeta
              title={`${post.frontmatter.title} · Raphael El Mouallem`}
              description={post.frontmatter.description}
              path={`/blog/${slug}`}
              image={
                post.frontmatter.cover
                  ? `${SITE_URL}/blog/${slug}/${post.frontmatter.cover}`
                  : undefined
              }
              imageAlt={post.frontmatter.cover ? post.frontmatter.title : undefined}
              type="article"
              publishedTime={post.frontmatter.date}
              tags={post.frontmatter.tags}
              jsonLd={jsonLd}
            />
            <main className="mx-auto px-4 sm:px-10 lg:px-16 py-[12vh] grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-16">
              <aside className="hidden md:block">
                <div className="sticky top-[10vh]">
                  <TableOfContents toc={post.toc} title="Back to blog" titleHref="/blog" />
                </div>
              </aside>

              <article>
                <p className="font-body text-[0.8rem] tracking-[0.08em] uppercase text-ink-faint mb-3">
                  {formatDate(post.frontmatter.date)} · {post.readingTime.text}
                </p>
                <h1 className="font-display text-[clamp(2rem,4.5vw,2.75rem)] font-extrabold leading-tight text-ink mb-3">
                  {post.frontmatter.title}
                </h1>
                <p className="font-body text-base text-ink-soft mb-6 max-w-160">
                  {post.frontmatter.description}
                </p>
                {post.frontmatter.tags?.length > 0 && (
                  <p className="text-[0.8rem] text-ink-faint mb-6">
                    {post.frontmatter.tags.map((t, i) => (
                      <span key={t}>
                        {i > 0 && <span className="mx-2">·</span>}
                        {t}
                      </span>
                    ))}
                  </p>
                )}

                <a
                  href={`/downloads/${slug}.md`}
                  download
                  data-cursor="hover"
                  className="inline-flex items-center gap-1.5 font-body text-[0.78rem] text-ink-soft bg-paper border border-border rounded-xs px-2.5 py-0.75 no-underline hover:text-ink hover:border-ink-faint transition-colors duration-150 mb-10"
                >
                  Download .md
                </a>

                <nav className="md:hidden mb-10 pb-6 border-b border-border">
                  <TableOfContents toc={post.toc} />
                </nav>

                <div ref={proseRef} className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
              </article>
            </main>

            <PageFooter />
          </>
        )}
      </AsyncState>
    </div>
  )
}
