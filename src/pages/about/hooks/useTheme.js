import { useEffect, useState } from 'react'

const STORAGE_KEY = 'about-theme'

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme) {
      root.setAttribute('data-theme', theme)
      localStorage.setItem(STORAGE_KEY, theme)
    } else {
      root.removeAttribute('data-theme')
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [theme])

  const [resolved, setResolved] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    if (theme) {
      setResolved(theme)
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setResolved(mq.matches ? 'dark' : 'light')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [theme])

  const toggle = () => {
    setTheme((current) => {
      const base = current ?? resolved
      return base === 'dark' ? 'light' : 'dark'
    })
  }

  return { theme: resolved, toggle }
}
