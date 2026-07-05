import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ocean } from './ocean'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

const fishGeometry = createFishGeometry()
const { SAND_MESH_Y } = ocean

function createFishGeometry() {
  const vertices = []
  const indices = []

  const bodySegs = 8
  const bodyRings = 6
  for (let r = 0; r <= bodyRings; r++) {
    const phi = (r / bodyRings) * Math.PI
    for (let s = 0; s <= bodySegs; s++) {
      const theta = (s / bodySegs) * Math.PI * 2
      vertices.push(
        Math.cos(theta) * Math.sin(phi) * 0.6,
        Math.sin(theta) * Math.sin(phi) * 0.18,
        Math.cos(phi) * 0.25
      )
    }
  }

  for (let r = 0; r < bodyRings; r++) {
    for (let s = 0; s < bodySegs; s++) {
      const a = r * (bodySegs + 1) + s
      const b = a + bodySegs + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const base = vertices.length / 3
  vertices.push(
    -0.6,
    0,
    0.05,
    -0.6,
    0,
    -0.05,
    -1.1,
    0.35,
    0,
    -1.1,
    -0.35,
    0,
    -0.78,
    0.05,
    0,
    -0.78,
    -0.05,
    0
  )
  indices.push(base, base + 2, base + 4)
  indices.push(base + 1, base + 4, base + 3)
  indices.push(base, base + 4, base + 1)
  indices.push(base + 4, base + 5, base + 3)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function Fish() {
  const cfg = useConfig()
  const { color, emissive, glowIntensity } = cfg.water.fish
  const groupRef = useRef()
  const meshRef = useRef()
  const basePositions = useRef(null)
  const geo = fishGeometry

  const { radius, speed, phase, depth, yOffset, flickSpeed, depthDrift, radiusDrift } = useMemo(
    () => ({
      radius: 8 + Math.random() * 12,
      speed: 0.15 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      depth: SAND_MESH_Y + 12 + Math.random() * 6,
      yOffset: Math.random() * Math.PI * 2,
      flickSpeed: 2.5 + Math.random() * 2,
      depthDrift: Math.random() * Math.PI * 2,
      radiusDrift: Math.random() * Math.PI * 2,
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current) return
    const t = clock.getElapsedTime()

    const angle = t * speed + phase
    const r = radius + Math.sin(t * 0.25 + radiusDrift) * 1.5
    const currentDepth = depth + Math.sin(t * 0.3 + depthDrift) * 0.8

    groupRef.current.position.x = Math.cos(angle) * r
    groupRef.current.position.z = Math.sin(angle) * r - 15
    groupRef.current.position.y = currentDepth

    groupRef.current.rotation.y = -angle - Math.PI / 2
    groupRef.current.rotation.z = Math.sin(t * speed * 3 + phase) * 0.15
    groupRef.current.rotation.x = Math.sin(t * 0.4 + yOffset) * 0.06

    const positions = meshRef.current.geometry.attributes.position
    if (!basePositions.current) {
      basePositions.current = new Float32Array(positions.array)
    }
    for (let i = 0; i < positions.count; i++) {
      const bx = basePositions.current[i * 3]
      const by = basePositions.current[i * 3 + 1]
      const bz = basePositions.current[i * 3 + 2]
      const isTail = bx < -0.5
      const wave = Math.sin(t * flickSpeed + bx * 4 + phase) * Math.abs(bx) * 0.12
      positions.setY(i, by + wave)
      if (isTail) positions.setZ(i, bz + wave * 0.5)
    }
    positions.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geo}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={glowIntensity}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <pointLight color={emissive} intensity={glowIntensity} distance={5} decay={2} />
    </group>
  )
}

export default function FishSchool() {
  const cfg = useConfig()
  return (
    <group>
      {Array.from({ length: cfg.water.fish.count }, (_, i) => (
        <Fish key={i} />
      ))}
    </group>
  )
}
