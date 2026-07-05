import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

function buildTexture(cfg) {
  const W = 1024,
    H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, cfg.sky.top)
  grad.addColorStop(0.5, cfg.sky.mid)
  grad.addColorStop(1, cfg.sky.bottom)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  return new THREE.CanvasTexture(canvas)
}

export default function Skybox() {
  const cfg = useConfig()
  const texture = useMemo(() => buildTexture(cfg), [cfg])

  useEffect(() => {
    document.body.style.background = cfg.sky.top
    return () => {
      document.body.style.background = ''
    }
  }, [cfg.sky.top])

  return (
    <mesh>
      <sphereGeometry args={[450, 48, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}
