import { getOtherPositions } from './petRegistry'

const RING = [
  'front',
  'front-right',
  'right',
  'back-right',
  'back',
  'back-left',
  'left',
  'front-left',
]
const CARDINAL_IDX = { front: 0, right: 2, back: 4, left: 6 }
const DIRECTIONS = [
  { dx: 1, dy: 0, facing: 'right' },
  { dx: -1, dy: 0, facing: 'left' },
  { dx: 0, dy: 1, facing: 'front' },
  { dx: 0, dy: -1, facing: 'back' },
]

const lerp = (a, b, t) => a + (b - a) * t
const rand = ([min, max]) => min + Math.random() * (max - min)

const LAUNCH_DURATION = 500
const DANCE_DURATION = 900

function stepToward(currentFacing, targetFacing) {
  const cur = RING.indexOf(currentFacing)
  const tgt = CARDINAL_IDX[targetFacing]
  const fwd = (tgt - cur + 8) % 8
  const back = (cur - tgt + 8) % 8
  const next = (cur + (fwd <= back ? 1 : -1) + 8) % 8
  return RING[next]
}

export function createHopEngine({
  x = 0,
  y = 0,
  hopDistance = 60,
  hopDuration = 260,
  turnDuration = 200,
  turnPause = 220,
  pauseRange = [500, 1800],
  bounds: initialBounds,
  id = null,
  collisionRadius,
} = {}) {
  let bounds = initialBounds
  const minGap = collisionRadius ?? hopDistance * 0.8

  let state = {
    x,
    y,
    facing: 'front',
    phase: 'idle',
    hopProgress: 0,
    turnProgress: 0,
    danceProgress: 0,
    from: { x, y },
    to: { x, y },
    hopStartedAt: 0,
    turnStartedAt: 0,
    danceStartedAt: 0,
    nextActionAt: performance.now() + rand(pauseRange),
    desiredDir: null,
    pendingAction: null,
    actionEvent: null,
  }

  function setBounds(b) {
    bounds = b
  }

  function pickDirection() {
    let candidates = DIRECTIONS
    if (bounds) {
      candidates = DIRECTIONS.filter((d) => {
        const nx = state.x + d.dx * hopDistance
        const ny = state.y + d.dy * hopDistance
        return nx >= bounds.minX && nx <= bounds.maxX && ny >= bounds.minY && ny <= bounds.maxY
      })
      if (candidates.length === 0) candidates = DIRECTIONS
    }
    if (id) {
      const others = getOtherPositions(id)
      const clear = candidates.filter((d) => {
        const nx = state.x + d.dx * hopDistance
        const ny = state.y + d.dy * hopDistance
        return others.every((p) => Math.hypot(p.x - nx, p.y - ny) >= minGap)
      })
      if (clear.length > 0) candidates = clear
    }
    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  function randomPointInBounds() {
    if (!bounds) return { x: state.x, y: state.y }
    return { x: rand([bounds.minX, bounds.maxX]), y: rand([bounds.minY, bounds.maxY]) }
  }

  function fireAction(action, now) {
    if (action === 'dance') {
      return {
        ...state,
        phase: 'dancing',
        pendingAction: null,
        danceStartedAt: now,
        danceProgress: 0,
      }
    }
    return {
      ...state,
      phase: 'idle',
      pendingAction: null,
      nextActionAt: now + rand(pauseRange),
      actionEvent: { type: 'mood', token: now + Math.random() },
    }
  }

  function interact(now) {
    if (state.phase !== 'idle') return state

    const roll = Math.random()
    const action = roll < 0.7 ? 'mood' : roll < 0.9 ? 'launch' : 'dance'

    if (action === 'launch') {
      state = {
        ...state,
        phase: 'launching',
        from: { x: state.x, y: state.y },
        to: randomPointInBounds(),
        hopStartedAt: now,
      }
    } else if (state.facing === 'front') {
      state = fireAction(action, now)
    } else {
      state = {
        ...state,
        phase: 'turning',
        facing: stepToward(state.facing, 'front'),
        pendingAction: action,
        turnStartedAt: now,
      }
    }
    return state
  }

  function tick(now) {
    if (bounds) {
      state = {
        ...state,
        x: Math.min(Math.max(state.x, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(state.y, bounds.minY), bounds.maxY),
      }
    }

    if (state.phase === 'idle' && state.pendingAction) {
      if (state.facing !== 'front') {
        state = {
          ...state,
          phase: 'turning',
          facing: stepToward(state.facing, 'front'),
          turnStartedAt: now,
        }
      } else {
        state = fireAction(state.pendingAction, now)
      }
    } else if (state.phase === 'idle' && now >= state.nextActionAt) {
      const dir = state.desiredDir ?? pickDirection()
      if (state.facing !== dir.facing) {
        state = {
          ...state,
          phase: 'turning',
          facing: stepToward(state.facing, dir.facing),
          desiredDir: dir,
          turnStartedAt: now,
        }
      } else {
        state = {
          ...state,
          phase: 'hopping',
          desiredDir: null,
          from: { x: state.x, y: state.y },
          to: { x: state.x + dir.dx * hopDistance, y: state.y + dir.dy * hopDistance },
          hopStartedAt: now,
        }
      }
    } else if (state.phase === 'turning') {
      const t = Math.min(1, (now - state.turnStartedAt) / turnDuration)
      state = { ...state, turnProgress: t }
      if (t >= 1)
        state = { ...state, phase: 'idle', nextActionAt: now + turnPause, turnProgress: 0 }
    } else if (state.phase === 'hopping') {
      const t = Math.min(1, (now - state.hopStartedAt) / hopDuration)
      state = {
        ...state,
        x: lerp(state.from.x, state.to.x, t),
        y: lerp(state.from.y, state.to.y, t),
        hopProgress: t,
      }
      if (t >= 1) state = { ...state, phase: 'idle', nextActionAt: now + rand(pauseRange) }
    } else if (state.phase === 'launching') {
      const t = Math.min(1, (now - state.hopStartedAt) / LAUNCH_DURATION)
      state = {
        ...state,
        x: lerp(state.from.x, state.to.x, t),
        y: lerp(state.from.y, state.to.y, t),
        hopProgress: t,
      }
      if (t >= 1) state = { ...state, phase: 'idle', nextActionAt: now + rand(pauseRange) }
    } else if (state.phase === 'dancing') {
      const t = Math.min(1, (now - state.danceStartedAt) / DANCE_DURATION)
      state = { ...state, danceProgress: t }
      if (t >= 1)
        state = { ...state, phase: 'idle', nextActionAt: now + rand(pauseRange), danceProgress: 0 }
    }

    return state
  }

  return { tick, getState: () => state, setBounds, interact }
}
