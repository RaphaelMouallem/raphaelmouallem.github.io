import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { ocean } from './ocean'

const { WATER_MESH_Y } = ocean

function shaftGeometry(width, height, taper = 0.08) {
  const geo = new THREE.BufferGeometry()
  const hw = width / 2
  const tw = hw * taper
  const verts = new Float32Array([-hw, 0, 0, hw, 0, 0, tw, -height, 0, -tw, -height, 0])
  const idx = new Uint16Array([0, 1, 2, 0, 2, 3])
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  geo.setIndex(new THREE.BufferAttribute(idx, 1))
  geo.computeVertexNormals()
  return geo
}

export default function GodRays() {
  const groupRef = useRef()
  const cfg = useConfig()
  const { count, opacity, color } = cfg.water.godRays

  const rays = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        angleY: Math.random() * Math.PI * 2,
        tiltX: 0.15 + Math.random() * 0.45,
        tiltZ: (Math.random() - 0.5) * 0.3,
        radius: 2 + Math.random() * 14,
        width: 0.6 + Math.random() * 1.2,
        height: 14 + Math.random() * 10,
        speed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        taper: 0.04 + Math.random() * 0.1,
      })),
    [count]
  )

  const geometries = useMemo(
    () => rays.map((r) => shaftGeometry(r.width, r.height, r.taper)),
    [rays]
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((ray, i) => {
      const r = rays[i]
      ray.material.opacity =
        opacity * 0.3 + Math.abs(Math.sin(t * r.speed + r.phase)) * opacity * 0.9
      ray.rotation.z = r.tiltZ + Math.sin(t * r.speed * 0.7 + r.phase) * 0.04
    })
  })

  return (
    <group ref={groupRef} position={[0, WATER_MESH_Y, -10]}>
      {rays.map((r, i) => (
        <mesh
          key={i}
          geometry={geometries[i]}
          position={[Math.cos(r.angleY) * r.radius, 0, Math.sin(r.angleY) * r.radius]}
          rotation={[r.tiltX, r.angleY, r.tiltZ]}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
