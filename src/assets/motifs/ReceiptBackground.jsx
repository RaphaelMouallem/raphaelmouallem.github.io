import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useIsMobile } from '@/hooks/useIsMobile'

const GITHUB_USER = 'RaphaelMouallem'
const GITHUB_URL = `https://github.com/${GITHUB_USER}`
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`
const CACHE_KEY = 'gh-repos-receipt-cache'
const CACHE_TTL_MS = 30 * 60 * 1000

function sizeInMB(sizeKB) {
  return sizeKB / 1024
}

function formatMB(mb) {
  return `${mb.toFixed(2)} MB`
}

function tornEdgeClipPath(teeth = 12) {
  const points = ['0% 0%', '100% 0%', '100% 96%']
  for (let i = 0; i <= teeth; i++) {
    const x = 100 - (i / teeth) * 100
    const y = i % 2 === 0 ? 96 : 100
    points.push(`${x}% ${y}%`)
  }
  points.push('0% 96%')
  return `polygon(${points.join(', ')})`
}

const TORN_EDGE = tornEdgeClipPath()
const PUNCH_HOLES = Array.from({ length: 9 }, (_, i) => i)

async function loadRepos() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { at, repos } = JSON.parse(cached)
      if (Date.now() - at < CACHE_TTL_MS) return repos
    }
  } catch {
    // something
  }

  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const data = await res.json()

  const repos = data
    .filter((r) => !r.fork)
    .map((r) => ({ name: r.name, sizeKB: r.size }))
    .sort((a, b) => b.sizeKB - a.sizeKB)

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }))
  } catch {
    // somethin
  }

  return repos
}

export default function ReceiptBackground({ content }) {
  const [state, setState] = useState({ status: 'loading', repos: [] })
  const isMobile = useIsMobile(768)

  useEffect(() => {
    let cancelled = false
    loadRepos()
      .then((repos) => {
        if (!cancelled) setState({ status: 'ready', repos })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', repos: [] })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const total = state.repos.reduce((sum, r) => sum + sizeInMB(r.sizeKB), 0)
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none select-none"
      style={
        isMobile
          ? { top: '58vh', left: '50%', width: '82vw', maxWidth: '20rem' }
          : { top: '8vh', right: '6%', width: '27rem' }
      }
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: 1,
        y: 0,
        x: isMobile ? '-50%' : 0,
      }}
      transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.15 }}
    >
      <div className="relative">
        <div className="absolute -right-4 -top-4 z-10 w-20 h-20 rounded-full border-[3px] border-accent flex items-center justify-center text-accent bg-paper-raised opacity-90">
          <span className="text-[0.7rem] font-extrabold tracking-[0.03em] text-center leading-tight uppercase">
            {content.thanks}
          </span>
        </div>

        <div
          className="relative bg-paper-raised border border-border shadow-[0_18px_40px_var(--shadow)] pb-12 font-mono text-ink overflow-hidden"
          style={{ clipPath: TORN_EDGE }}
        >
          <div className="absolute inset-y-0 left-1 w-3 flex flex-col justify-evenly py-6 z-10">
            {PUNCH_HOLES.map((i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-paper shrink-0" />
            ))}
          </div>
          <div className="absolute inset-y-0 right-1 w-3 flex flex-col justify-evenly py-6 z-10">
            {PUNCH_HOLES.map((i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-paper shrink-0" />
            ))}
          </div>

          <div className="bg-accent text-paper text-center py-4 px-8 mb-6">
            <div className="text-[1.35rem] font-extrabold tracking-widest">{content.title}</div>
            <div className="text-[0.85rem] opacity-85 mt-1">{GITHUB_URL.replace('https://', '')}</div>
          </div>

          <div className="px-8">
            <div className="text-[0.9rem] text-ink-soft text-center mb-4">{date}</div>

            <div className="border-t-2 border-dashed border-accent/40 my-4" />

            <div className="flex flex-col gap-2.5 text-[0.95rem] leading-tight">
              {state.status === 'loading' &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between opacity-40 animate-pulse">
                    <span>{'· '.repeat(14)}</span>
                    <span>--.-- MB</span>
                  </div>
                ))}

              {state.status === 'error' && (
                <div className="text-center text-ink-soft py-3">{content.offline}</div>
              )}

              {state.status === 'ready' &&
                state.repos.map((r) => (
                  <div key={r.name} className="flex justify-between gap-4">
                    <span className="truncate">{r.name}</span>
                    <span className="shrink-0">{formatMB(sizeInMB(r.sizeKB))}</span>
                  </div>
                ))}
            </div>

            <div className="border-t-2 border-dashed border-accent/40 my-4" />

            <div className="flex justify-between items-center text-[1.15rem] font-extrabold mb-6 bg-accent-soft text-accent px-4 py-2.5 -mx-2">
              <span>{content.total}</span>
              <span>{state.status === 'ready' ? formatMB(total) : '--.-- MB'}</span>
            </div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile"
              className="pointer-events-auto flex flex-col items-center gap-2.5 w-fit mx-auto"
            >
              <QRCodeSVG value={GITHUB_URL} size={isMobile ? 100 : 130} bgColor="transparent" fgColor="var(--accent)" level="M" />
              <span className="text-[0.85rem] tracking-[0.08em] text-accent font-semibold">
                {content.scanForMore}
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
