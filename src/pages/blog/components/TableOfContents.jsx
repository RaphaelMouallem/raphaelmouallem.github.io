import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function TableOfContents({ toc, title, titleHref, className = '' }) {
  const [activeId, setActiveId] = useState(null)
  const idsRef = useRef(flattenIds(toc))

  useEffect(() => {
    idsRef.current = flattenIds(toc)
    if (idsRef.current.length === 0) return

    const LINE = 96

    function updateActive() {
      let current = null
      for (const id of idsRef.current) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - LINE <= 0) current = id
        else break
      }
      setActiveId(current ?? idsRef.current[0])
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [toc])

  if (!toc || toc.length === 0) return null

  return (
    <nav aria-label="Table of contents" className={className}>
      {title && (
        <Link
          to={titleHref ?? '#'}
          data-cursor="hover"
          className="block font-display text-[0.92rem] font-semibold leading-snug text-accent mb-4 pb-4 border-b border-border no-underline"
        >
          {title}
        </Link>
      )}
      <ol className="flex flex-col gap-3 list-none m-0 p-0">
        {toc.map((heading) => (
          <TocEntry key={heading.id} heading={heading} activeId={activeId} />
        ))}
      </ol>
    </nav>
  )
}

function TocEntry({ heading, activeId }) {
  const isActive = heading.id === activeId
  const childActive = heading.children.some((c) => c.id === activeId)

  return (
    <li>
      <a
        href={`#${heading.id}`}
        data-cursor="hover"
        aria-current={isActive ? 'location' : undefined}
        className={`block font-body text-[0.85rem] leading-snug border-l-2 pl-3 -ml-px transition-colors duration-150 no-underline ${
          isActive || childActive
            ? 'border-accent text-ink font-medium'
            : 'border-transparent text-ink-soft hover:text-ink'
        }`}
      >
        {heading.text}
      </a>
      {heading.children.length > 0 && (
        <ol className="flex flex-col gap-2 list-none mt-2 pl-3">
          {heading.children.map((child) => (
            <li key={child.id}>
              <a
                href={`#${child.id}`}
                data-cursor="hover"
                aria-current={child.id === activeId ? 'location' : undefined}
                className={`block font-body text-[0.8rem] leading-snug border-l-2 pl-3 -ml-px transition-colors duration-150 no-underline ${
                  child.id === activeId
                    ? 'border-accent text-ink font-medium'
                    : 'border-transparent text-ink-faint hover:text-ink-soft'
                }`}
              >
                {child.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </li>
  )
}

function flattenIds(toc) {
  const ids = []
  for (const heading of toc ?? []) {
    ids.push(heading.id)
    for (const child of heading.children) ids.push(child.id)
  }
  return ids
}
