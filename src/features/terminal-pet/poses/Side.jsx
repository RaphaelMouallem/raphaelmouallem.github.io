import { VentPanel } from '../../shared/VentPanel'

export default function Side() {
  return (
    <svg
      viewBox="0 0 240 230"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="65,30 175,30 166,10 74,10"
        fill="var(--paper-soft)"
        stroke="var(--border)"
        strokeWidth="1"
      />

      <rect
        x="65"
        y="30"
        width="110"
        height="170"
        fill="var(--paper-raised)"
        stroke="var(--border)"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 10px 18px var(--shadow))' }}
      />
      <circle cx="80" cy="44" r="4" fill="#e0554a" />

      <g transform="translate(65,30)">
        <VentPanel />
      </g>
    </svg>
  )
}
