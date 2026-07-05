import { useState, useEffect } from 'react'

export function usePageBounds(size, spawnRef) {
  const [bounds, setBounds] = useState(null)
  const [spawn, setSpawn] = useState(null)

  useEffect(() => {
    const page = document.querySelector('.about-page')
    if (!page) return

    const update = () => {
      setBounds({ minX: 0, minY: 0, maxX: page.scrollWidth - size, maxY: page.scrollHeight - size })
      setSpawn((prev) => {
        if (prev || !spawnRef.current) return prev
        const pageRect = page.getBoundingClientRect()
        const zone = spawnRef.current.getBoundingClientRect()
        return {
          x: zone.left - pageRect.left + Math.random() * Math.max(1, zone.width - size),
          y: zone.top - pageRect.top + Math.random() * Math.max(1, zone.height - size),
        }
      })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(page)
    return () => observer.disconnect()
  }, [size, spawnRef])

  return { bounds, spawn }
}
