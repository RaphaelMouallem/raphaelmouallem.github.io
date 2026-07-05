import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { useVisibleBounds } from '@/pages/experience/hooks/useVisibleBounds'

function jitter(geo, amount) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 2 * amount)
    pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * 2 * amount)
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 2 * amount)
  }
  pos.needsUpdate = true
  return geo
}

function gaussianJitter(spread) {
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * (spread * 0.25)
}

function buildCloudGeo() {
  const t1 = jitter(new THREE.SphereGeometry(1.8, 7, 8), 0.12)
  t1.translate(-1.5, 0, 0)

  const t2 = jitter(new THREE.SphereGeometry(1.8, 7, 8), 0.12)
  t2.translate(1.5, 0, 0)

  const t3 = jitter(new THREE.SphereGeometry(2.4, 7, 8), 0.12)
  t3.translate(0, 0.8, 0)

  const t4 = jitter(new THREE.SphereGeometry(1.4, 7, 8), 0.12)
  t4.translate(3.2, 0.2, 0)

  const t5 = jitter(new THREE.SphereGeometry(1.4, 7, 8), 0.12)
  t5.translate(-3.2, 0.2, 0)

  let merged = mergeGeometries([t1, t2, t3, t4, t5])
  merged.computeVertexNormals()
  return merged
}

function Cloud({ position, scale, color }) {
  const geo = useMemo(() => buildCloudGeo(), [])
  const groupRef = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const breathe = 1 + Math.sin(t * 0.4 + offset) * 0.03
    groupRef.current.scale.y = scale[1] * breathe
    groupRef.current.position.x = position[0] + Math.cos(t * 0.1 + offset) * 1.5
    groupRef.current.position.z = position[2] + Math.sin(t * 0.1 + offset) * 1.5
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh geometry={geo}>
        <meshLambertMaterial color={color} flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const BANKS = [
  { y: -10, pct: 0.15, minR: 15, maxR: 40 },
  { y: -15, pct: 0.12, minR: 60, maxR: 130 },
  { y: -55, pct: 0.23, minR: 15, maxR: 45 },
  { y: -60, pct: 0.15, minR: 65, maxR: 140 },
  { y: -75, pct: 0.15, minR: 15, maxR: 40 },
  { y: -80, pct: 0.2, minR: 60, maxR: 130 },
]

export default function Clouds() {
  const cfg = useConfig()
  const { color, scaleRange, cloudCount } = cfg.clouds
  const { getHalfWidth, aspect } = useVisibleBounds()

  const clouds = useMemo(() => {
    return BANKS.flatMap((bank) => {
      const count = Math.round(cloudCount * bank.pct)
      return Array.from({ length: count }, () => {
        const [smin, smax] = scaleRange
        const s = smin + Math.random() * (smax - smin)
        const angle = (Math.random() - 0.5) * (Math.PI * 1.4) + Math.PI * 1.5
        const r = bank.minR + Math.random() * (bank.maxR - bank.minR)
        let x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const maxX = getHalfWidth(z)
        x = Math.max(-maxX, Math.min(maxX, x))
        const onPath = Math.abs(x) < 15 && z > -40 && z < 20
        if (onPath) x = x < 0 ? x - 20 : x + 20
        return { position: [x, bank.y + gaussianJitter(12), z], scale: [s, s * 0.6, s] }
      })
    })
  }, [cloudCount, scaleRange[0], scaleRange[1], aspect])

  return (
    <group>
      <ambientLight intensity={0.15} />
      <ambientLight color="#ff9966" intensity={0.5} />
      <directionalLight color="#ffe066" intensity={2.0} position={[0, 1, 0]} />
      <directionalLight color={cfg.clouds.lightBottom} intensity={0.4} position={[-1, -1, 0]} />
      {clouds.map((c, i) => (
        <Cloud key={i} position={c.position} scale={c.scale} color={color} />
      ))}
    </group>
  )
}
