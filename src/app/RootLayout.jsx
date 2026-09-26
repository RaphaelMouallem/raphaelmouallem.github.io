import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </>
  )
}
