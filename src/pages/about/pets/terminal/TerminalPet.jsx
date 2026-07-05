import Front from './poses/Front'
import Back from './poses/Back'
import Diagonal from './poses/Diagonal'
import { FACES } from './faces'
import Side from './poses/Side'

const POSES = {
  front: { Comp: Front },
  back: { Comp: Back },
  left: { Comp: Side },
  right: { Comp: Side, mirror: true },
  'front-left': { Comp: Diagonal, variant: 'front', facing: 'right' },
  'front-right': { Comp: Diagonal, variant: 'front', facing: 'left' },
  'back-left': { Comp: Diagonal, variant: 'back', facing: 'left' },
  'back-right': { Comp: Diagonal, variant: 'back', facing: 'right' },
}

export default function TerminalPet({ facing = 'front', mood = 'neutral', size = 160, style }) {
  const { Comp, mirror, ...poseProps } = POSES[facing] ?? POSES.front
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: '240 / 230', ...style }}>
      <div style={mirror ? { transform: 'scaleX(-1)' } : undefined}>
        <Comp
          {...poseProps}
          face={FACES[mood] ?? mood}
          glitching={mood === 'glitch' || mood === 'loading'}
        />
      </div>
    </div>
  )
}
