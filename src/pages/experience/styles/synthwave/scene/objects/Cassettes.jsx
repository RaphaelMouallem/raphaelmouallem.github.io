import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { useVisibleBounds } from '@/pages/experience/hooks/useVisibleBounds'
import { rand } from '@/pages/experience/styles/synthwave/scene/stars/utils'

function buildCassetteEdges(color, labelColor) {
  const group = new THREE.Group()

  const edgeMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  })
  const labelMat = new THREE.LineBasicMaterial({
    color: labelColor,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  })
  const reelMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  })

  function addEdges(geo, mat, parent = group) {
    const edges = new THREE.EdgesGeometry(geo)
    const line = new THREE.LineSegments(edges, mat)
    parent.add(line)
    geo.dispose()
    return line
  }

  addEdges(new THREE.BoxGeometry(3.2, 2.0, 0.5), edgeMat)

  const winGeo = new THREE.BoxGeometry(1.6, 0.7, 0.52)
  const win = addEdges(
    winGeo,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false })
  )
  win.position.set(0, 0.1, 0)

  const label = addEdges(new THREE.BoxGeometry(2.6, 0.7, 0.52), labelMat)
  label.position.set(0, -0.55, 0)

  const reelL = new THREE.Group()
  addEdges(new THREE.TorusGeometry(0.42, 0.05, 6, 16), reelMat, reelL)
  addEdges(new THREE.CylinderGeometry(0.12, 0.12, 0.52, 8), reelMat, reelL)
  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.BoxGeometry(0.06, 0.38, 0.52)
    const s = addEdges(spoke, reelMat, reelL)
    s.rotation.z = (i / 3) * Math.PI
  }
  reelL.position.set(-0.62, 0.18, 0)
  group.add(reelL)

  const reelR = reelL.clone()
  reelR.position.set(0.62, 0.18, 0)
  group.add(reelR)

  const notchL = addEdges(new THREE.BoxGeometry(0.18, 0.18, 0.52), edgeMat)
  notchL.position.set(-1.3, -0.85, 0)
  const notchR = addEdges(new THREE.BoxGeometry(0.18, 0.18, 0.52), edgeMat)
  notchR.position.set(1.3, -0.85, 0)

  return { group, reelL, reelR }
}

const DEPTH_BANDS = [
  { y: -12, xRange: [-50, 50], zRange: [-70, -15] },
  { y: -28, xRange: [-65, 65], zRange: [-80, -10] },
  { y: -45, xRange: [-60, 60], zRange: [-75, -15] },
  { y: -62, xRange: [-70, 70], zRange: [-80, -10] },
  { y: -78, xRange: [-50, 50], zRange: [-70, -15] },
]

function Cassette({ position, rotation, scale, phase }) {
  const cfg = useConfig()
  const { color, labelColor } = cfg.cassettes
  const groupRef = useRef()
  const reelLRef = useRef()
  const reelRRef = useRef()

  const { group, reelL, reelR } = useMemo(
    () => buildCassetteEdges(color, labelColor),
    [color, labelColor]
  )

  useMemo(() => {
    reelLRef.current = reelL
    reelRRef.current = reelR
  }, [reelL, reelR])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.6
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.15) * 0.08
    groupRef.current.rotation.y = rotation[1] + t * 0.12
    if (reelLRef.current) reelLRef.current.rotation.z += 0.008
    if (reelRRef.current) reelRRef.current.rotation.z -= 0.008
  })

  return (
    <primitive
      ref={groupRef}
      object={group}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    />
  )
}

export default function Cassettes() {
  const cfg = useConfig()
  const { count, scale } = cfg.cassettes
  const { getHalfWidth, aspect } = useVisibleBounds()

  const cassettes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const band = DEPTH_BANDS[i % DEPTH_BANDS.length]
      const z = rand(band.zRange[0], band.zRange[1])
      const maxX = getHalfWidth(z)
      const xMin = Math.max(band.xRange[0], -maxX)
      const xMax = Math.min(band.xRange[1], maxX)
      const x = xMin < xMax ? rand(xMin, xMax) : 0
      return {
        position: [x, band.y + rand(-4, 4), z],
        rotation: [rand(-Math.PI, Math.PI), rand(-Math.PI, Math.PI), rand(-Math.PI, Math.PI)],
        scale: scale * rand(0.8, 1.3),
        phase: rand(0, Math.PI * 2),
      }
    })
  }, [count, scale, aspect])

  return (
    <group>
      {cassettes.map((c, i) => (
        <Cassette key={i} {...c} />
      ))}
    </group>
  )
}
