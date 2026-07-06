import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Camera from './scene/Camera'
import World from './scene/World'
import LoadingScreen from './ui/LoadingScreen'
import { SceneReadyTracker } from './scene/SceneReadyTracker'
import { useNavigate } from 'react-router-dom'

export default function Experience() {
  const navigate = useNavigate()
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LoadingScreen onSkip={() => navigate('/about')} />
      <Canvas>
        <ambientLight intensity={1} />
        <SceneReadyTracker />
        <ScrollControls pages={10} damping={0.3}>
          <Camera />
          <World />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
