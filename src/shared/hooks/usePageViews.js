import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageViews() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname + location.search

    if (typeof window.goatcounter?.count === 'function') {
      window.goatcounter.count({ path })
      return
    }

    const interval = setInterval(() => {
      if (typeof window.goatcounter?.count === 'function') {
        window.goatcounter.count({ path })
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [location])
}
