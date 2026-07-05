import { useFrame } from '@react-three/fiber'
import { useLoadingStore } from '../store/useLoadingStore'

export function SceneReadyTracker() {
  const tick = useLoadingStore((s) => s.tick)
  useFrame(tick)
  return null
}
