export const RADIUS = 240

export function randomHemispherePoint(radius) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(1 - v)
  const r = radius * (0.8 + Math.random() * 0.2)
  return [
    r * Math.sin(phi) * Math.cos(theta),
    Math.abs(r * Math.cos(phi)),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

export function rand(min, max) {
  return min + Math.random() * (max - min)
}
