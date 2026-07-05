import { useMemo } from 'react'
import * as THREE from 'three'
import { RADIUS, randomHemispherePoint } from './utils'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

export default function SmallStars() {
  const cfg = useConfig()
  const count = cfg.stars.small.count
  const [min, max] = cfg.stars.small.sizeRange

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const palette = cfg.stars.colors.map((c) => new THREE.Color(c))

    for (let i = 0; i < count; i++) {
      const [x, y, z] = randomHemispherePoint(RADIUS)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const col = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
      sizes[i] = min + Math.random() * (max - min)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [count, cfg])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        vertexColors
        sizeAttenuation
        size={1.5}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  )
}
