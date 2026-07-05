const SPEAKER_COLS = [2, 3, 4, 3, 2]
const COL_SPACING = 11
const ROW_SPACING = 15
const HOLE_R = 3

export function SpeakerCluster({ cx, cy }) {
  return (
    <g fill="var(--ink-faint)">
      {SPEAKER_COLS.map((count, c) =>
        Array.from({ length: count }, (_, i) => {
          const x = cx + (c - (SPEAKER_COLS.length - 1) / 2) * COL_SPACING
          const y = cy + (i - (count - 1) / 2) * ROW_SPACING
          return <circle key={`${c}-${i}`} cx={x} cy={y} r={HOLE_R} />
        })
      )}
    </g>
  )
}
