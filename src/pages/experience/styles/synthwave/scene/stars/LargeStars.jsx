import { useMemo } from 'react'
import * as THREE from 'three'
import { RADIUS, randomHemispherePoint } from './utils'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

function buildStarTexture(color) {
  const S = 128
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, S, S)

  const cx = S / 2,
    cy = S / 2

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.5)
  glow.addColorStop(0, color + 'cc')
  glow.addColorStop(0.4, color + '44')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, S, S)

  ctx.beginPath()
  ctx.moveTo(cx, cy - S * 0.45)
  ctx.lineTo(cx + S * 0.12, cy)
  ctx.lineTo(cx, cy + S * 0.45)
  ctx.lineTo(cx - S * 0.12, cy)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(cx - S * 0.45, cy)
  ctx.lineTo(cx - S * 0.08, cy - S * 0.04)
  ctx.lineTo(cx, cy)
  ctx.lineTo(cx - S * 0.08, cy + S * 0.04)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(cx + S * 0.45, cy)
  ctx.lineTo(cx + S * 0.08, cy - S * 0.04)
  ctx.lineTo(cx, cy)
  ctx.lineTo(cx + S * 0.08, cy + S * 0.04)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

export default function LargeStars() {
  const cfg = useConfig()
  const { count, poolSize, sizeRange } = cfg.stars.large

  const stars = useMemo(() => {
    const palette = cfg.stars.colors
    const pool = Array.from({ length: poolSize }, () => {
      const color = palette[Math.floor(Math.random() * palette.length)]
      return buildStarTexture(color)
    })

    return Array.from({ length: count }, (_, i) => {
      const [x, y, z] = randomHemispherePoint(RADIUS * 0.95)
      const [min, max] = sizeRange
      return {
        x,
        y,
        z,
        texture: pool[i % poolSize],
        size: min + Math.random() * (max - min),
        rotation: Math.random() * Math.PI * 2,
      }
    })
  }, [count, cfg])

  return (
    <>
      {stars.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} rotation={[0, 0, s.rotation]}>
          <planeGeometry args={[s.size, s.size]} />
          <meshBasicMaterial map={s.texture} transparent depthWrite={false} />
        </mesh>
      ))}
    </>
  )
}
