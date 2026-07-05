import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

export default function Sky() {
  const cfg = useConfig()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: `linear-gradient(to bottom, ${cfg.sky.top}, ${cfg.sky.mid} 50%, ${cfg.sky.bottom})`,
        pointerEvents: 'none',
      }}
    />
  )
}
