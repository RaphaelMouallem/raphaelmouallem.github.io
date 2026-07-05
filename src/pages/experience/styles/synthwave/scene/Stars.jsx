import SmallStars from './stars/SmallStars'
import LargeStars from './stars/LargeStars'
import ShootingStars from './stars/ShootingStars'
import Galaxies from './stars/Galaxies'

export default function Stars({ isDark = true }) {
  if (!isDark) return null
  return (
    <group renderOrder={-2}>
      <SmallStars />
      <LargeStars />
      <ShootingStars />
      <Galaxies />
    </group>
  )
}
