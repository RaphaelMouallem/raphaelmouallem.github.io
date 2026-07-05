import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useStyle } from '../hooks/useStyle'

const PITCH_UP = -Math.PI / 2
const PITCH_FORWARD = -Math.PI / 6
const MOUSE_TILT_ROOM = 0.12
const MOUSE_TILT_FALLING = 0.04
const LERP_SPEED = 0.04

export default function Camera() {
  const isMobile = window.innerWidth < 768
  const { camera } = useThree()
  const scroll = useScroll()
  const mouse = useRef({ x: 0, y: 0 })
  const { sections } = useStyle()
  const currentPitch = useRef(PITCH_UP)

  camera.rotation.order = 'YXZ'
  camera.position.set(0, 0, 0)

  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x
    mouse.current.y = pointer.y

    const offset = scroll.offset
    const section = sections.find((s) => offset >= s.from && offset < s.to) ?? sections.at(-1)
    const isRoom = section.mode === 'room'

    const targetPitch = isRoom ? PITCH_UP : PITCH_FORWARD
    currentPitch.current -= (targetPitch + currentPitch.current) * LERP_SPEED

    const tiltStrength = isRoom ? MOUSE_TILT_ROOM : MOUSE_TILT_FALLING
    camera.rotation.x = currentPitch.current + (isMobile ? 0 : -mouse.current.y * tiltStrength)
    camera.rotation.y = isMobile ? 0 : -mouse.current.x * tiltStrength
  })

  return null
}
