import { useMemo } from 'react'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

function buildSunTexture(cfg) {
  const S = 2048
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, S, S)

  const cx = S / 2
  const cy = S / 2
  const r = S * cfg.sun.sunScale

  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * cfg.sun.glowRadius)
  outerGlow.addColorStop(0, cfg.sun.glowInner + '66')
  outerGlow.addColorStop(0.25, cfg.sun.glowInner + '44')
  outerGlow.addColorStop(0.5, cfg.sun.glowOuter + '22')
  outerGlow.addColorStop(0.8, cfg.sun.glowOuter + '0a')
  outerGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = outerGlow
  ctx.fillRect(0, 0, S, S)

  const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
  grad.addColorStop(0, cfg.sun.colorTop)
  grad.addColorStop(0.5, cfg.sun.colorMid)
  grad.addColorStop(1, cfg.sun.colorBottom)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  const innerGlow = ctx.createRadialGradient(cx, cy - r * 0.2, 0, cx, cy, r)
  innerGlow.addColorStop(0, 'rgba(255,255,255,0.25)')
  innerGlow.addColorStop(0.5, 'transparent')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = innerGlow
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

export default function Sun({ isDark = true }) {
  const cfg = useConfig()

  const materials = useMemo(() => {
    const blank = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      depthWrite: false,
    })
    const sun = new THREE.MeshBasicMaterial({
      map: buildSunTexture(cfg),
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    })
    return isDark
      ? [blank, blank, blank, blank, blank, sun]
      : [blank, blank, sun, blank, blank, blank]
  }, [cfg, isDark])

  const size = 650
  return (
    <mesh renderOrder={-1}>
      <boxGeometry args={[size, size, size]} />
      <primitive object={materials} attach="material" />
    </mesh>
  )
}
