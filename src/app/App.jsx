import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AppRoutes />
      </MotionConfig>
    </BrowserRouter>
  )
}
