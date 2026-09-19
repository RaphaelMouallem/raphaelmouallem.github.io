import { Link } from 'react-router-dom'
import '@/styles/tokens.css'
import ThemeToggle from '@/components/ThemeToggle'
import CharacterRain, { WATER_LINE_VH } from '../../assets/CharacterRain'

export default function NotFoundPage() {
  return (
    <div className="about-page relative min-h-screen overflow-hidden bg-paper text-ink font-body selection:bg-accent selection:text-white">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;800&family=Inter:wght@400;500;600&display=swap"
      />

      <CharacterRain />

      <header className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </header>

      <main className="relative z-[1] min-h-screen pointer-events-none">
        <div className="absolute left-[8%] right-[8%] top-[28vh] max-w-[560px] pointer-events-auto">
          <h1 className="font-display text-[clamp(3.5rem,9vw,6rem)] font-extrabold mb-5 leading-none">
            404
          </h1>
          <p className="font-body text-base text-ink-soft m-0 leading-[1.7] max-w-[460px]">
            There's nothing at this address. It may have moved, or never existed.
          </p>
        </div>

        <div
          className="absolute left-[8%] flex gap-6 flex-wrap pointer-events-auto"
          style={{ top: `calc(${WATER_LINE_VH}vh + 36px)` }}
        >
          <Link
            to="/"
            className="inline-block [transition:transform_150ms_cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] font-body text-[0.85rem] font-semibold tracking-[0.02em] text-ink no-underline px-[26px] py-3.5 rounded-full border border-border bg-paper-raised"
          >
            Back home
          </Link>
        </div>
      </main>
    </div>
  )
}
