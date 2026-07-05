import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { ocean } from './ocean'

const { SEGMENTS_X, SEGMENTS_Z, WIDTH, DEPTH, WATER_MESH_Y, getWaveHeight, getRippleDisplacement } =
  ocean

export default function WaterSurface() {
  const meshRef = useRef()
  const cfg = useConfig()
  const { color, waveSpeed } = cfg.water.surface

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
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.85}
        depthWrite={false}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  )
}
