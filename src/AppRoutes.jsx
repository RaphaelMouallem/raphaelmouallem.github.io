import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useIsMobile } from './ui/components/utils'
import { usePageViews } from './hooks/usePageViews'

const Experience = lazy(() => import('./pages/experience/Experience'))
const AboutPage = lazy(() => import('./pages/about/AboutPage'))

function RootRoute() {
  const isMobile = useIsMobile()
  return isMobile ? <AboutPage /> : <Experience />
}

export default function AppRoutes() {
  usePageViews()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/3d" element={<Experience />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  )
}
