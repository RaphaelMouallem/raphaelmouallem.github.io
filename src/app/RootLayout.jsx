import { Outlet } from 'react-router-dom'
import Navbar from '@/shared/layout/Navbar'
import ErrorBoundary from "@/shared/layout/ErrorBoundary";

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
