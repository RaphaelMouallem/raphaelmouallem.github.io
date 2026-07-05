import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const INTRO_END = 0.08
const DROP_DURATION = 0.4
const WIRE_COLOR = '#ff6ec7'

const cocoonGeo = new THREE.IcosahedronGeometry(2.5, 1)
const solidMat = new THREE.MeshBasicMaterial({ color: '#000000', side: THREE.BackSide })
const wireMat = new THREE.MeshBasicMaterial({
  color: WIRE_COLOR,
  wireframe: true,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.9,
})

export default function Intro() {
  const scroll = useRef(useScroll())
  const groupRef = useRef()
  const hasDropped = useRef(false)
  const dropTimer = useRef(0)
  const opacity = useRef(1)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const offset = scroll.current.offset

    if (!hasDropped.current) {
      if (offset >= INTRO_END) {
        hasDropped.current = true
        dropTimer.current = 0
      }
      groupRef.current.position.y = offset * 80
    } else {
      dropTimer.current += delta
      const t = Math.min(dropTimer.current / DROP_DURATION, 1)
      const ease = t * t * t
      groupRef.current.position.y = INTRO_END * 80 + ease * 60
      opacity.current = Math.max(0, 1 - ease * 2)
      wireMat.opacity = opacity.current
      if (t >= 1) groupRef.current.visible = false
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh geometry={cocoonGeo} material={solidMat} />
      <mesh geometry={cocoonGeo} material={wireMat} />
    </group>
  )
}
