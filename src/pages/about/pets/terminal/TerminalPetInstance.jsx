import { useId } from 'react'
import Hopper from '../behaviors/Hopper'
import TerminalPet from './TerminalPet'
import { useMoodEngine } from '../engines/useMoodEngine'
import { usePageBounds } from '../engines/usePageBounds'
import { FACES } from './faces'
import { useIsMobile } from '@/ui/components/utils'

export default function TerminalPetInstance({ size = 80, spawnRef, style }) {
  const id = useId()
  const isMobile = useIsMobile()
  const { mood, trigger } = useMoodEngine({ moods: Object.keys(FACES), initial: 'neutral' })
  const { bounds, spawn } = usePageBounds(size, spawnRef)

  if (isMobile || !spawn) return null

  return (
    <Hopper
      id={id}
      size={size}
      bounds={bounds}
      initial={spawn}
      onMoodTrigger={trigger}
      style={style}
    >
      {({ facing, phase }) => (
        <div data-cursor="hover" data-cursor-label="> poke">
          <TerminalPet facing={facing} mood={mood} size={size} />
        </div>
      )}
    </Hopper>
  )
}
