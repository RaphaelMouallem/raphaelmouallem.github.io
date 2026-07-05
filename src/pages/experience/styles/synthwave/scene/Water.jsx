import { VerticalBubbles } from './water/VerticalBubbles'
import { Caustics } from './water/Caustics'
import CRTField from './water/CRT'
import WaterGrid from './water/WaterGrid'
import WaterSurface from './water/WaterSurface'
import UnderwaterVolume from './water/UnderwaterVolume'
import GodRays from './water/GodRays'

export default function Water() {
  return (
    <group>
      <WaterSurface />
      <WaterGrid />
      <VerticalBubbles />
      <CRTField />
      <UnderwaterVolume />
      <GodRays />
      <Caustics />
    </group>
  )
}
