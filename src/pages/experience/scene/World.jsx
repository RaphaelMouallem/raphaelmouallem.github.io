import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useStyle } from '../hooks/useStyle'
import Navbar from '../ui/Navbar'
import UI from '../ui/UI'

export default function World() {
  const { SceneWorld, isDark, onScrollUpdate, getUnderwaterThreshold } = useStyle()

  const groupRef = useRef()
  const scroll = useScroll()
  const bounceT = useRef(0)
  const wasBouncing = useRef(false)
  const lastOffset = useRef(0)
  const isUnderwater = useRef(false)
  const [underwater, setUnderwater] = useState(false)

  const underwaterThreshold = getUnderwaterThreshold?.() ?? null

  useFrame(() => {
    const offset = scroll.offset
    const atBottom = offset >= 0.99
    const tryingToScrollDown = offset > lastOffset.current

    if (atBottom && tryingToScrollDown && !wasBouncing.current) {
      bounceT.current = 0
      wasBouncing.current = true
    }
    if (!atBottom) wasBouncing.current = false
    lastOffset.current = offset

    if (wasBouncing.current) {
      bounceT.current = Math.min(bounceT.current + 0.018, 1)
      if (bounceT.current >= 1) wasBouncing.current = false
    }

    const bounceOffset = wasBouncing.current ? Math.sin(bounceT.current * Math.PI) * 0.6 : 0

    onScrollUpdate?.({ offset, groupRef, bounceOffset })

    if (underwaterThreshold !== null) {
      const nowUnderwater = offset >= underwaterThreshold
      if (nowUnderwater !== isUnderwater.current) {
        isUnderwater.current = nowUnderwater
        setUnderwater(nowUnderwater)
      }
    }
  })

  return (
    <>
      <Navbar />
      <UI />
      <SceneWorld isDark={isDark} groupRef={groupRef} underwater={underwater} />
    </>
  )
}
