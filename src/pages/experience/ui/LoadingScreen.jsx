import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useLoadingStore } from '../store/useLoadingStore'
import { useStyle } from '../hooks/useStyle'

export default function LoadingScreen({ onSkip }) {
  const [fade, setFade] = useState(false)
  const [done, setDone] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const { progress: assetProgress, active } = useProgress()
  const frames = useLoadingStore((s) => s.frames)
  const progress = active ? assetProgress : Math.min(100, (frames / 90) * 100)
  const ready = !active && progress >= 100
  const { LoadingScreen: StyleLoadingScreen } = useStyle()

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setFade(true)
    setTimeout(() => setDone(true), 600)
  }

  if (done) return null

  return (
    <StyleLoadingScreen
      progress={progress}
      fade={fade}
      ready={ready}
      showSkip={showSkip}
      onSkip={onSkip}
      onEnter={handleEnter}
    />
  )
}
