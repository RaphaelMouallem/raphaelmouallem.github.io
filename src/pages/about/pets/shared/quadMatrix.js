export function quadMatrix(topLeft, topRight, bottomLeft, w, h) {
  const [x0, y0] = topLeft
  const [x1, y1] = topRight
  const [x2, y2] = bottomLeft
  const a = (x1 - x0) / w
  const b = (y1 - y0) / w
  const c = (x2 - x0) / h
  const d = (y2 - y0) / h
  return `matrix(${a},${b},${c},${d},${x0},${y0})`
}
