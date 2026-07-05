import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RADIUS } from './utils'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

function buildShootingStarTexture(color) {
  const W = 256,
    H = 32
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)

  const grad = ctx.createLinearGradient(0, 0, W, 0)
  grad.addColorStop(0, 'transparent')
  grad.addColorStop(0.7, color + '44')
  grad.addColorStop(0.9, color + 'cc')
  grad.addColorStop(1, '#ffffff')
  ctx.fillStyle = grad
  ctx.fillRect(0, H * 0.35, W, H * 0.3)

  const head = ctx.createRadialGradient(W, H / 2, 0, W, H / 2, H * 0.5)
  head.addColorStop(0, '#ffffff')
  head.addColorStop(0.3, color + 'cc')
  head.addColorStop(1, 'transparent')
  ctx.fillStyle = head
  ctx.fillRect(W * 0.8, 0, W * 0.2, H)

  return new THREE.CanvasTexture(canvas)
}

function randomStartPoint() {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.random() * Math.PI * 0.9
  const r = RADIUS * 0.85
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

export default function ShootingStars() {
  const cfg = useConfig()
  const { speed, length, thickness, cooldown } = cfg.stars.shooting
  const color = cfg.stars.colors[0]
  const texture = useMemo(() => buildShootingStarTexture(color), [color])

  const meshRef = useRef()
  const progressRef = useRef(1)
  const cooldownRef = useRef(0)
  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())

  function fire() {
    const start = randomStartPoint()
    startPos.current.copy(start)
    const angle = Math.random() * Math.PI * 2
    endPos.current.set(
      start.x + Math.cos(angle) * 120,
      start.y - 20 - Math.random() * 40,
      start.z + Math.sin(angle) * 120
    )
    progressRef.current = 0
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (progressRef.current >= 1) {
      meshRef.current.visible = false
      cooldownRef.current -= delta
      if (cooldownRef.current <= 0) {
        fire()
        cooldownRef.current = cooldown * 0.3
      }
      return
    }

    progressRef.current += delta * speed * 2.5
    const t = progressRef.current
    meshRef.current.visible = true
    meshRef.current.position.lerpVectors(startPos.current, endPos.current, t)

    const dir = endPos.current.clone().sub(startPos.current).normalize()
    meshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir)
    meshRef.current.material.opacity = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2
  })

  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[length, thickness]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}
