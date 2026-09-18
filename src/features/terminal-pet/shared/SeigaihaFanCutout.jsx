import { FAN_PATHS } from '../../assets/seigaihaMotif'

export function SeigaihaFanCutout({ x, y, scale = 0.7, open = 'right' }) {
  const rot = open === 'right' ? 90 : -90
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale}) translate(-42.24 -23.5)`}>
      {FAN_PATHS.map((d, i) => (
        <path key={i} d={d} fill="var(--accent)" opacity={0.95 - i * 0.06} />
      ))}
    </g>
  )
}
