export { night, day } from './config'
export { theme } from './theme'
export { default as Cards } from './ui/Cards'
export { default as World } from './scene/SynthwaveWorld'
export { default as ConfigPanel } from './ui/ConfigPanel'
export { default as LoadingScreen } from './ui/LoadingScreen'
export { onScrollUpdate, getUnderwaterThreshold } from './scene/SynthwaveWorld'

export const SECTIONS = [
  { from: 0, to: 0.08, mode: 'room', label: 'Intro' },
  { from: 0.08, to: 0.35, mode: 'falling', label: 'About' },
  { from: 0.35, to: 0.72, mode: 'falling', label: 'Projects' },
  { from: 0.72, to: 0.92, mode: 'falling', label: 'Contact' },
  { from: 0.92, to: 1.0, mode: 'falling', label: 'Footer' },
]
