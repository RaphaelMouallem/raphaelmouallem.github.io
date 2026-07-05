import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { ocean } from './ocean'

const { WIDTH, DEPTH, WATER_MESH_Y } = ocean

export default function UnderwaterVolume() {
  const cfg = useConfig()
  return (
    <mesh position={[0, WATER_MESH_Y - 15, 0]}>
      <boxGeometry args={[WIDTH, 30, DEPTH]} />
      <meshBasicMaterial
        color={cfg.water.surface.color}
        transparent
        opacity={0.35}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
