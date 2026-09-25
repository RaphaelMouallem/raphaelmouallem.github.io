import { Link } from 'react-router-dom'
import { useState } from 'react'
import '@/styles/tokens.css'
import ThemeToggle from '@/components/ThemeToggle'
import { useContent } from '@/hooks/useContent'
import CharacterRain, { WATER_LINE_VH } from '@/assets/motifs/CharacterRain'
import ReceiptBackground from '@/assets/motifs/ReceiptBackground'

export default function NotFoundPage() {
  const { notFound } = useContent()
  const [variant] = useState(() => (Math.random() < 0.5 ? 'rain' : 'receipt'))
  return (
    <div className="about-page relative min-h-screen overflow-hidden bg-paper text-ink font-body selection:bg-accent selection:text-white">
      {variant === 'rain' ? <CharacterRain /> : <ReceiptBackground content={notFound.receipt} />}

      <header className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </header>

      <main className="relative z-1 min-h-screen pointer-events-none">
        <div className="absolute left-[8%] right-[8%] top-[28vh] max-w-140 pointer-events-auto">
          <h1 className="font-display text-[clamp(3.5rem,9vw,6rem)] font-extrabold mb-5 leading-none">
            {notFound.code}
          </h1>
          <p className="font-body text-base text-ink-soft m-0 leading-[1.7] max-w-115">
            {notFound.message}
          </p>
        </div>

        <div
          className="absolute left-[8%] flex gap-6 flex-wrap pointer-events-auto"
          style={{ top: variant === 'rain' ? `calc(${WATER_LINE_VH}vh + 36px)` : 'calc(28vh + 220px)' }}
        >
          <Link
            to="/"
            className="inline-block [transition:transform_150ms_cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] font-body text-[0.85rem] font-semibold tracking-[0.02em] text-ink no-underline px-6.5 py-3.5 rounded-full border border-border bg-paper-raised"
          >
            {notFound.backHome}
          </Link>
        </div>
      </main>
    </div>
  )
}
