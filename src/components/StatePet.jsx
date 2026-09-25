import Front from '@/features/terminal-pet/poses/Front'
import { FACES } from '@/features/terminal-pet/faces'

const ANIM_CLASS = {
  loading: 'state-pet-dance',
  sleepy: 'state-pet-sleep',
  dead: 'state-pet-shake',
  glitch: 'state-pet-shake',
}

export default function StatePet({ mood = 'loading', size = 104 }) {
  const glitching = mood === 'glitch' || mood === 'loading' || mood === 'dead'
  return (
    <div className={`relative ${ANIM_CLASS[mood] ?? ''}`} style={{ width: size, aspectRatio: '240 / 230' }}>
      <Front face={FACES[mood] ?? mood} glitching={glitching} />
      {mood === 'sleepy' && (
        <span className="state-pet-zzz" aria-hidden="true">
          z
        </span>
      )}
    </div>
  )
}