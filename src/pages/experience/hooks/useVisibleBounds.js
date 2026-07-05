import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export function useVisibleBounds() {
  const { camera, size } = useThree()
  const aspect = size.width / size.height
  const vFov = THREE.MathUtils.degToRad(camera.fov)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)

  const getHalfWidth = (depth, margin = 1.15) => {
    return Math.abs(depth) * Math.tan(hFov / 2) * margin
  }

  return { getHalfWidth, aspect }
}
