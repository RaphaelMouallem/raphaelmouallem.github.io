export function createMoodEngine({ moods, initial } = {}) {
  const pool = moods ?? []
  let state = {
    previousMood: null,
    mood: initial ?? pool[0],
  }

  function trigger(mood) {
    if (mood) {
      state = { mood }
      return state
    }
    const options = pool.filter((m) => m !== state.mood)
    const next = options[Math.floor(Math.random() * options.length)] ?? state.mood
    state = { mood: next }
    return state
  }

  function flicker(flickerMoods) {
    const previous = state.mood
    const options = flickerMoods.filter((m) => m !== previous)
    const next = options[Math.floor(Math.random() * options.length)] ?? previous
    state = { mood: next, previousMood: previous }
    return state
  }

  function revert() {
    if (state.previousMood) state = { mood: state.previousMood, previousMood: null }
    return state
  }

  return { getState: () => state, trigger, flicker, revert }
}
