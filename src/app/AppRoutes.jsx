import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { usePageViews } from './hooks/usePageViews'

const Experience = lazy(() => import('./pages/experience/Experience'))
const AboutPage = lazy(() => import('./pages/about/AboutPage'))
const NotFoundPage = lazy(() => import('./pages/not-found/NotFoundPage'))

export default function AppRoutes() {
  usePageViews()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/3d" element={<Experience />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
