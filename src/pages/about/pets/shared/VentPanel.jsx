export function VentPanel() {
  return (
    <>
      <rect x="65" y="16" width="24" height="3" fill="var(--accent)" opacity="0.8" />
      <rect x="65" y="24" width="24" height="3" fill="var(--accent)" opacity="0.8" />
      <rect x="65" y="32" width="24" height="3" fill="var(--accent)" opacity="0.8" />

      <circle cx="15" cy="70" r="3.5" fill="var(--accent)" />
      <circle cx="15" cy="82" r="3.5" fill="var(--accent)" />
      <circle cx="15" cy="94" r="3.5" fill="var(--accent)" />
      <circle cx="15" cy="106" r="3.5" fill="var(--accent)" opacity="0.3" />

      <rect
        x="85"
        y="152"
        width="14"
        height="9"
        fill="var(--paper-sunken)"
        stroke="var(--border)"
        strokeWidth="1"
      />
    </>
  )
}
