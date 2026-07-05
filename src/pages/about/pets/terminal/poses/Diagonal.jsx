import { quadMatrix } from '../../shared/quadMatrix'
import { SeigaihaFanCutout } from '../../shared/SeigaihaFanCutout'
import { SpeakerCluster } from '../../shared/SpeakerCluster'
import { VentPanel } from '../../shared/VentPanel'

const LOCAL_W = 140
const LOCAL_H = 154

export default function Diagonal({ variant = 'front', facing = 'left', face = '^_^' }) {
  const R = facing === 'right'

  const sideFace = R ? '220,28 220,198 174,216 174,46' : '20,28 20,198 66,216 66,46'
  const topSliver = R ? '220,28 174,46 34,20 80,2' : '20,28 66,46 206,20 160,2'

  const topLeft = R ? [174, 46] : [66, 46]
  const topRight = R ? [34, 20] : [206, 20]
  const bottomLeft = R ? [174, 216] : [66, 216]
  const frontFace = `${topLeft} ${topRight} ${R ? '34,190' : '206,190'} ${bottomLeft}`

  const m = quadMatrix(topLeft, topRight, bottomLeft, LOCAL_W, LOCAL_H)

  const SIDE_LOCAL_W = 110
  const SIDE_LOCAL_H = 170
  const sideTopLeft = R ? [220, 28] : [20, 28]
  const sideTopRight = R ? [174, 46] : [66, 46]
  const sideBottomLeft = R ? [220, 198] : [20, 198]
  const sideM = quadMatrix(sideTopLeft, sideTopRight, sideBottomLeft, SIDE_LOCAL_W, SIDE_LOCAL_H)

  return (
    <svg
      viewBox="0 0 240 230"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points={sideFace}
        fill="var(--paper-sunken)"
        stroke="var(--border)"
        style={{ filter: 'drop-shadow(0 8px 14px var(--shadow))' }}
      />
      <g transform={sideM}>
        <VentPanel />
      </g>
      <polygon points={topSliver} fill="var(--paper-soft)" stroke="var(--border)" />
      <polygon
        points={frontFace}
        fill="var(--paper-raised)"
        stroke="var(--border)"
        style={{ filter: 'drop-shadow(0 10px 18px var(--shadow))' }}
      />

      <g transform={m}>
        {variant === 'front' ? (
          <>
            <g transform={R ? `translate(${LOCAL_W},0) scale(-1,1)` : undefined}>
              {['#e0554a', '#e0ab4a', '#5f9e5a'].map((c, i) => (
                <circle key={i} cx={16 + i * 14} cy="16" r="3.4" fill={c} />
              ))}
            </g>
            <rect x="15" y="29" width="110" height="107" fill="var(--accent)" />
            <rect x="22" y="36" width="96" height="93" fill="var(--paper-sunken)" />
            <g transform={R ? 'translate(146,0) scale(-1,1)' : undefined}>
              <text
                x="73"
                y="100"
                fontSize="54"
                fontWeight="700"
                fill="var(--ink)"
                textAnchor="middle"
              >
                {face}
              </text>
            </g>
          </>
        ) : (
          <>
            <SpeakerCluster cx={70} cy={41} />
            <SeigaihaFanCutout x={54} y={118} scale={0.58} open="right" />
            <SeigaihaFanCutout x={86} y={118} scale={0.58} open="left" />
          </>
        )}
      </g>
    </svg>
  )
}
