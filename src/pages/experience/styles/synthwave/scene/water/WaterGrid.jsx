import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { ocean } from './ocean'

const { SEGMENTS_X, SEGMENTS_Z, WIDTH, DEPTH, WATER_MESH_Y, getWaveHeight, getRippleDisplacement } =
  ocean

export default function WaterGrid() {
  const meshRef = useRef()
  const cfg = useConfig()
  const { gridColor, waveSpeed } = cfg.water.surface

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WIDTH, DEPTH, SEGMENTS_X, SEGMENTS_Z)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position
    const time = clock.getElapsedTime() * waveSpeed
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      positions.setY(i, getWaveHeight(x, z, time) + getRippleDisplacement(x, z, time))
    }
    positions.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={gridColor} wireframe transparent opacity={0.6} />
    </mesh>
  )
}
