import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import Front from '@/features/terminal-pet/poses/Front'
import HamburgerIcon from '@/assets/icons/HamburgerIcon'
import { useContent } from '@/hooks/useContent'
import { easeOut } from '@/styles/motion'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Blog' },
  { to: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { intro } = useContent()
  const prefersReducedMotion = useReducedMotion()

  const [heroHidden, setHeroHidden] = useState(false)
  const revealed = isHome ? heroHidden : true

  const [menuOpen, setMenuOpen] = useState(false)

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!isHome) return
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setHeroHidden(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 transition-colors duration-500 ${
        revealed
          ? 'bg-paper/80 backdrop-blur-md border-b border-border pointer-events-auto'
          : 'bg-transparent border-b border-transparent pointer-events-none'
      }`}
    >
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 pointer-events-auto"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <span className="flex items-center min-h-6">
        {revealed && (
          <m.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Link
              to="/"
              data-cursor="hover"
              className="pointer-events-auto flex items-center gap-2 no-underline rounded-full"
            >
              <span className="relative block w-12 aspect-240/230 shrink-0">
                <Front fontSize="0.64rem" />
              </span>
              <span className="hidden sm:inline font-display text-[0.95rem] font-semibold text-accent">
                {intro.name}
              </span>
            </Link>
          </m.span>
        )}
      </span>

      <div className="flex items-center gap-2 ml-auto pointer-events-auto">
        <nav className="hidden sm:flex items-center gap-5">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-cursor="hover"
              className={({ isActive }) =>
                `font-body text-[0.85rem] no-underline transition-colors duration-150 rounded-full ${
                  isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <span className="hidden sm:block">
          <ThemeToggle />
        </span>

        <m.button
          onClick={() => setMenuOpen((v) => !v)}
          data-cursor="hover"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15, ease: easeOut }}
          className="sm:hidden w-10 h-10 rounded-full border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
        >
          <HamburgerIcon open={menuOpen} />
        </m.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            id="mobile-nav-panel"
            key="mobile-menu"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="sm:hidden absolute top-full inset-x-0 flex flex-col bg-paper-soft border-b border-border pointer-events-auto"
            style={{ boxShadow: '0 14px 28px var(--shadow)' }}
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-cursor="hover"
                className={({ isActive }) =>
                  `px-6 py-4 font-body text-[0.95rem] no-underline border-b border-border transition-colors duration-150 ${
                    isActive ? 'text-accent font-semibold' : 'text-ink-soft'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between px-6 py-3">
              <span className="font-body text-[0.85rem] text-ink-soft">Theme</span>
              <ThemeToggle />
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
