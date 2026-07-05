import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RADIUS, randomHemispherePoint } from './utils'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

function buildGalaxyTexture(color1, color2) {
  const S = 256
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, S, S)

  const cx = S / 2,
    cy = S / 2

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5)
  glow.addColorStop(0, color1 + 'aa')
  glow.addColorStop(0.5, color2 + '55')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, S, S)

  for (let arm = 0; arm < 4; arm++) {
    const armAngle = (arm / 4) * Math.PI * 2
    ctx.beginPath()
    for (let i = 0; i < 60; i++) {
      const t = i / 60
      const angle = armAngle + t * Math.PI * 1.5
      const r = t * S * 0.42
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = color1 + '99'
    ctx.lineWidth = 1.5
    ctx.stroke()

    for (let i = 0; i < 12; i++) {
      const t = i / 12
      const angle = armAngle + t * Math.PI * 1.5
      const r = t * S * 0.42
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      ctx.beginPath()
      ctx.arc(x, y, (1 - t) * 2 + 0.5, 0, Math.PI * 2)
      ctx.fillStyle = color2
      ctx.fill()
    }
  }

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.08)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.5, color1 + 'cc')
  core.addColorStop(1, 'transparent')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, S, S)

  return new THREE.CanvasTexture(canvas)
}

export default function Galaxies() {
  const cfg = useConfig()
  const { count, poolSize, sizeRange, rotSpeed } = cfg.stars.galaxies
  const palette = cfg.stars.colors

  const galaxies = useMemo(() => {
    const pool = Array.from({ length: poolSize }, () => {
      const c1 = palette[Math.floor(Math.random() * palette.length)]
      const c2 = palette[Math.floor(Math.random() * palette.length)]
      return buildGalaxyTexture(c1, c2)
    })

    const [min, max] = sizeRange
    return Array.from({ length: count }, (_, i) => ({
      pos: randomHemispherePoint(RADIUS * 0.9),
      texture: pool[i % poolSize],
      size: min + Math.random() * (max - min),
      rotZ: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * rotSpeed,
    }))
  }, [count, palette])

  const refs = useRef(galaxies.map(() => null))

  useFrame(() => {
    refs.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.z += galaxies[i].rotSpeed
    })
  })

  return (
    <>
      {galaxies.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={g.pos}
          rotation={[0, 0, g.rotZ]}
        >
          <planeGeometry args={[g.size, g.size]} />
          <meshBasicMaterial map={g.texture} transparent depthWrite={false} />
        </mesh>
      ))}
    </>
  )
}
