const WIDTH = 160
const DEPTH = 80
const SEGMENTS_X = 60
const SEGMENTS_Z = 30

const WATER_MESH_Y = -120
const SAND_MESH_Y = -140
const ripples = []
const MAX_RIPPLES = 20
const RIPPLE_DURATION = 2.0

function getWaveHeight(x, z, time) {
  return WATER_MESH_Y + Math.sin(x * 2 + time) * 0.15 + Math.sin(z * 1.5 + time * 0.8) * 0.12
}

function addRipple(x, z, strength, time) {
  ripples.push({ x, z, startTime: time, strength })
  if (ripples.length > MAX_RIPPLES) ripples.shift()
}

function getRippleDisplacement(x, z, time) {
  let displacement = 0
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i]
    const age = time - ripple.startTime
    if (age > RIPPLE_DURATION) {
      ripples.splice(i, 1)
      continue
    }
    const dist = Math.sqrt((x - ripple.x) ** 2 + (z - ripple.z) ** 2)
    const waveRadius = age * 0.5
    const ringWidth = 0.15
    const ringDist = Math.abs(dist - waveRadius)
    if (ringDist < ringWidth) {
      const fade = 1 - age / RIPPLE_DURATION
      const ringFade = 1 - ringDist / ringWidth
      displacement += Math.sin(dist * 20 - age * 8) * 0.02 * fade * ringFade * ripple.strength
    }
  }
  return displacement
}

export const ocean = {
  WIDTH,
  DEPTH,
  SEGMENTS_X,
  SEGMENTS_Z,
  WATER_MESH_Y,
  SAND_MESH_Y,
  getWaveHeight,
  addRipple,
  getRippleDisplacement,
}
