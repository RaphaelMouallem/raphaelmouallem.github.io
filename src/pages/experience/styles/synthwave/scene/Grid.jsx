import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

export default function Grid() {
  const cfg = useConfig()
  const { color, opacity } = cfg.grid

  return (
    <mesh>
      <sphereGeometry args={[cfg.grid.radius, cfg.grid.segments, cfg.grid.segments]} />
      <meshBasicMaterial
        color={color}
        opacity={opacity}
        transparent
        wireframe
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
