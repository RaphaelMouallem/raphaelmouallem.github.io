import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { useVisibleBounds } from '@/pages/experience/hooks/useVisibleBounds'
import { rand } from './utils'

const TEMPLATES = [
  {
    name: 'Orion',
    stars: [
      [0, 2.2],
      [1.4, 2.5],
      [0, 0],
      [0.7, 0],
      [1.4, 0],
      [0, -1.8],
      [1.4, -1.8],
      [0.7, 1.2],
    ],
    edges: [
      [0, 7],
      [1, 7],
      [7, 2],
      [7, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
    ],
    bright: [0, 1, 2, 4],
  },
  {
    name: 'Cassiopeia',
    stars: [
      [0, 0],
      [1, 0.8],
      [2, 0.2],
      [3, 1.0],
      [4, 0.3],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    bright: [1, 3],
  },
  {
    name: 'BigDipper',
    stars: [
      [0, 0],
      [0.8, 0.3],
      [1.0, 1.1],
      [0.2, 1.0],
      [1.8, 1.4],
      [2.7, 1.1],
      [3.6, 0.7],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [2, 4],
      [4, 5],
      [5, 6],
    ],
    bright: [0, 2, 6],
  },
  {
    name: 'Leo',
    stars: [
      [0, 0.8],
      [1.0, 1.2],
      [1.8, 0.8],
      [2.0, 0],
      [1.6, -0.5],
      [2.5, 1.5],
      [2.2, 1.0],
      [2.8, 0.4],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [2, 6],
      [6, 5],
      [5, 7],
      [7, 3],
    ],
    bright: [2, 5, 0],
  },
  {
    name: 'Scorpio',
    stars: [
      [0, 0],
      [0.6, 0.4],
      [1.2, 0.3],
      [1.8, 0.1],
      [2.2, -0.4],
      [2.5, -1.0],
      [2.8, -1.7],
      [2.4, -2.3],
      [1.8, -2.6],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
    bright: [2, 8],
  },
  {
    name: 'Cross',
    stars: [
      [0, 1.5],
      [0, -1.5],
      [-1, 0],
      [1, 0],
      [0, 0],
    ],
    edges: [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ],
    bright: [4, 0],
  },
]

const DEPTH_BANDS = [
  { y: -8, xRange: [-55, 55], zRange: [-75, -20] },
  { y: -25, xRange: [-70, 70], zRange: [-85, -15] },
  { y: -42, xRange: [-65, 65], zRange: [-80, -15] },
  { y: -58, xRange: [-75, 75], zRange: [-85, -20] },
  { y: -74, xRange: [-55, 55], zRange: [-75, -15] },
]

function buildStarTexture(color) {
  const S = 64
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  const cx = S / 2,
    cy = S / 2
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5)
  glow.addColorStop(0, '#ffffff')
  glow.addColorStop(0.15, color + 'ff')
  glow.addColorStop(0.5, color + '66')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(canvas)
}

function buildStars3D(template, scale, rotY, rotZ) {
  const cx = template.stars.reduce((s, p) => s + p[0], 0) / template.stars.length
  const cy = template.stars.reduce((s, p) => s + p[1], 0) / template.stars.length
  return template.stars.map(([x, y]) => {
    const lx = (x - cx) * scale
    const ly = (y - cy) * scale
    const lz = (Math.random() - 0.5) * scale * 0.2
    return new THREE.Vector3(
      lx * Math.cos(rotY) + lz * Math.sin(rotY),
      ly,
      -lx * Math.sin(rotY) + lz * Math.cos(rotY)
    ).applyEuler(new THREE.Euler(0, 0, rotZ))
  })
}

function ConstellationMesh({
  stars3D,
  edges,
  brightIndices,
  position,
  color,
  lineOpacity,
  starSize,
  phaseOffset,
}) {
  const nodeRefs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phaseOffset
    nodeRefs.current.forEach((m, i) => {
      if (!m) return
      const isBright = brightIndices.includes(i)
      const base = isBright ? starSize * 1.8 : starSize
      const pulse = base * (1 + Math.sin(t * 1.2 + i * 0.9) * 0.12)
      m.scale.setScalar(pulse)
    })
  })

  const lineGeo = useMemo(() => {
    const pts = []
    edges.forEach(([a, b]) => {
      pts.push(stars3D[a], stars3D[b])
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [stars3D, edges])

  const texture = useMemo(() => buildStarTexture(color), [color])

  return (
    <group position={position}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={lineOpacity * 0.4}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={lineOpacity} depthWrite={false} />
      </lineSegments>
      {stars3D.map((p, i) => {
        const isBright = brightIndices.includes(i)
        const s = isBright ? starSize * 1.8 : starSize
        return (
          <mesh
            key={i}
            ref={(el) => {
              nodeRefs.current[i] = el
            }}
            position={p}
          >
            <planeGeometry args={[s, s]} />
            <meshBasicMaterial
              map={texture}
              transparent
              depthWrite={false}
              opacity={isBright ? 1.0 : 0.75}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Constellations() {
  const cfg = useConfig()
  const { count, scaleRange, lineOpacity, starSize, color } = cfg.stars.constellations
  const { getHalfWidth, aspect } = useVisibleBounds()

  const instances = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const band = DEPTH_BANDS[i % DEPTH_BANDS.length]
      const z = rand(band.zRange[0], band.zRange[1])
      const maxX = getHalfWidth(z)
      const xMin = Math.max(band.xRange[0], -maxX)
      const xMax = Math.min(band.xRange[1], maxX)
      const x = xMin < xMax ? rand(xMin, xMax) : 0
      const template = TEMPLATES[i % TEMPLATES.length]
      const scale = rand(scaleRange[0], scaleRange[1])
      const rotY = Math.random() * Math.PI * 2
      const rotZ = (Math.random() - 0.5) * 0.5
      return {
        stars3D: buildStars3D(template, scale, rotY, rotZ),
        edges: template.edges,
        brightIndices: template.bright,
        phaseOffset: Math.random() * Math.PI * 2,
        position: new THREE.Vector3(x, band.y + rand(-5, 5), z),
      }
    })
  }, [count, scaleRange[0], scaleRange[1], aspect])

  return (
    <group>
      {instances.map((inst, i) => (
        <ConstellationMesh
          key={i}
          {...inst}
          color={color}
          lineOpacity={lineOpacity}
          starSize={starSize}
        />
      ))}
    </group>
  )
}
