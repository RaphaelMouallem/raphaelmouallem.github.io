import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ocean } from './ocean'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

const { WIDTH, DEPTH, SAND_MESH_Y, getWaveHeight, addRipple } = ocean

export function VerticalBubbles() {
  const cfg = useConfig()
  const { count: bubbleCount, color: bubbleColor } = cfg.water.bubbles
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const bubbles = useMemo(
    () =>
      Array.from({ length: bubbleCount }, () => {
        const baseX = (Math.random() - 0.5) * WIDTH * 0.6
        const baseZ = (Math.random() - 0.5) * DEPTH * 0.6
        return {
          x: baseX,
          z: baseZ,
          y: SAND_MESH_Y + Math.random() * 1.5,
          baseX,
          baseZ,
          size: 0.08 + Math.random() * 0.25,
          speed: 0.5 + Math.random() * 1.2,
          wobblePhase: Math.random() * Math.PI * 2,
          wobbleFreq: 1 + Math.random() * 2,
        }
      }),
    [bubbleCount]
  )

  const bubblesRef = useRef(bubbles)
  bubblesRef.current = bubbles

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const arr = bubblesRef.current

    for (let i = 0; i < arr.length; i++) {
      const b = arr[i]
      b.y += b.speed * 0.016
      b.x = b.baseX + Math.sin(time * b.wobbleFreq + b.wobblePhase) * 0.03
      b.z = b.baseZ + Math.cos(time * b.wobbleFreq * 0.7 + b.wobblePhase) * 0.02

      const surface = getWaveHeight(b.x, b.z, time)
      const distToSurface = surface - b.y

      if (distToSurface < 0) {
        addRipple(b.x, b.z, b.size * 20, time)
        b.y = SAND_MESH_Y + b.size
      }

      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(b.size)
      const fade = Math.min(1, distToSurface / 2.0)
      dummy.scale.setScalar(b.size * fade)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      key={bubbleCount}
      ref={meshRef}
      args={[undefined, undefined, bubbleCount]}
      frustumCulled={false}
    >
      <torusGeometry args={[1, 0.18, 6, 12]} />
      <meshBasicMaterial color={bubbleColor} transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  )
}
