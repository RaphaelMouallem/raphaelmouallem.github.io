import { forwardRef, useRef, useEffect } from 'react'
import { useHopEngine } from '../engines/useHopEngine'

function squashStretch({ phase, hopProgress, turnProgress, danceProgress, size = 40 }) {
  if (phase === 'hopping') {
    const arc = Math.sin(hopProgress * Math.PI)
    const contact = Math.pow(1 - arc, 4)
    return {
      scaleX: 1 - arc * 0.14 + contact * 0.18,
      scaleY: 1 + arc * 0.22 - contact * 0.28,
      lift: arc * size * 0.15,
      rotate: 0,
    }
  }
  if (phase === 'launching') {
    const arc = Math.sin(hopProgress * Math.PI)
    const contact = Math.pow(1 - arc, 4)
    return {
      scaleX: 1 - arc * 0.22 + contact * 0.24,
      scaleY: 1 + arc * 0.34 - contact * 0.36,
      lift: arc * size * 0.4,
      rotate: 0,
    }
  }
  if (phase === 'turning') {
    const wobble = Math.sin(turnProgress * Math.PI) * 0.08
    return { scaleX: 1 + wobble, scaleY: 1 - wobble, lift: 0, rotate: 0 }
  }
  if (phase === 'dancing') {
    const wiggle = Math.sin(danceProgress * Math.PI * 6)
    return {
      scaleX: 1 - Math.abs(wiggle) * 0.08,
      scaleY: 1 + Math.abs(wiggle) * 0.1,
      lift: Math.abs(wiggle) * size * 0.08,
      rotate: wiggle * 8,
    }
  }
  return { scaleX: 1, scaleY: 1, lift: 0, rotate: 0 }
}

const Hopper = forwardRef(function Hopper(
  { id, size = 80, bounds, initial, style, onMoodTrigger, children },
  ref
) {
  const { x, y, facing, phase, hopProgress, turnProgress, danceProgress, actionEvent, interact } =
    useHopEngine({ id, bounds, x: initial?.x, y: initial?.y })
  const { scaleX, scaleY, lift, rotate } = squashStretch({
    phase,
    hopProgress,
    turnProgress,
    danceProgress,
    size,
  })

  const lastTokenRef = useRef(null)
  useEffect(() => {
    if (actionEvent && actionEvent.token !== lastTokenRef.current) {
      lastTokenRef.current = actionEvent.token
      if (actionEvent.type === 'mood') onMoodTrigger?.()
    }
  }, [actionEvent, onMoodTrigger])

  return (
    <div
      ref={ref}
      onClick={interact}
      role="button"
      tabIndex={0}
      aria-label="Decorative interactive terminal pet"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          interact()
        }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y - lift,
        transformOrigin: 'bottom center',
        transform: `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
        userSelect: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children({ facing, phase })}
    </div>
  )
})

export default Hopper
