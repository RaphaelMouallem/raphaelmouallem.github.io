import Stars from './Stars'
import Sun from './Sun'
import Grid from './Grid'
import Skybox from './Skybox'
import Clouds from './Clouds'
import Water from './Water'
import Intro from './Intro'
import Constellations from './stars/Constellations'
import Cassettes from './objects/Cassettes'
import Jellyfish from './objects/Jellyfish'

const TOTAL_DEPTH = 130

export default function SynthwaveWorld({ isDark, groupRef, underwater }) {
  return (
    <>
      {!underwater && isDark && <Stars />}
      {(!underwater || !isDark) && <Sun isDark={isDark} />}
      <Grid />
      <Skybox />
      <group ref={groupRef}>
        <Water position={[0, -TOTAL_DEPTH, 0]} />
        {!isDark && <Clouds />}
        {!isDark && <Cassettes />}
        {isDark && <Constellations />}
        {isDark && <Jellyfish />}
      </group>
      <Intro />
    </>
  )
}

export const TOTAL_DEPTH_SYNTHWAVE = TOTAL_DEPTH

export function onScrollUpdate({ offset, groupRef, bounceOffset }) {
  if (groupRef.current) {
    groupRef.current.position.y = offset * TOTAL_DEPTH + bounceOffset
  }
}

export function getUnderwaterThreshold() {
  return 0.93
}
