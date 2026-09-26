import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <AppRoutes />
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  )
}
