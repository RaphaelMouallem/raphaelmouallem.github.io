import { SeigaihaFanCutout } from '../../shared/SeigaihaFanCutout'
import { SpeakerCluster } from '../../shared/SpeakerCluster'

export default function Back() {
  return (
    <svg
      viewBox="0 0 240 230"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="35,30 205,30 191,10 49,10"
        fill="var(--paper-soft)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <rect
        x="35"
        y="30"
        width="170"
        height="170"
        fill="var(--paper-raised)"
        stroke="var(--border)"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 10px 18px var(--shadow))' }}
      />

      <SpeakerCluster cx={120} cy={75} />

      <SeigaihaFanCutout x={100} y={160} open="right" />
      <SeigaihaFanCutout x={140} y={160} open="left" />
    </svg>
  )
}
