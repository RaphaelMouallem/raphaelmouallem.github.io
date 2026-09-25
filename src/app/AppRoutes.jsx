import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { usePageViews } from '@/hooks/usePageViews'
import RootLayout from './RootLayout'

const HomePage = lazy(() => import('../pages/home/HomePage'))
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'))
const BlogIndexPage = lazy(() => import('../pages/blog/BlogIndexPage'))
const BlogPostPage = lazy(() => import('../pages/blog/BlogPostPage'))
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'))

export default function AppRoutes() {
  usePageViews()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
