import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { usePageViews } from '@/hooks/usePageViews'

const HomePage = lazy(() => import('../pages/home/HomePage'))
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'))

export default function AppRoutes() {
  usePageViews()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
