import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { useVisibleBounds } from '@/pages/experience/hooks/useVisibleBounds'
import { rand } from '../stars/utils'

const domeVertex = `
  uniform float uTime;
  uniform float uRingSpeed;
  uniform float uRingAmp;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv2;
  varying float vRing;

  void main() {
    vUv2 = uv;
    float ring = sin(uv.y * 9.0 - uTime * uRingSpeed) * 0.5 + 0.5;
    vRing = ring;
    // squeeze rings travel from pole (uv.y=0) to rim (uv.y=1), strongest near rim
    vec3 displaced = position + normal * ring * uRingAmp * uv.y;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const domeFragment = `
  uniform float uTime;
  uniform float uPulseSpeed;
  uniform vec3  uColor;
  uniform vec3  uGlowColor;
  varying vec3  vNormal;
  varying vec3  vViewPosition;
  varying vec2  vUv2;
  varying float vRing;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.0);
    float pulse = 0.5 + 0.5 * sin(uTime * uPulseSpeed);

    // bright highlight near the pole (uv.y = 0), fading toward the rim (uv.y = 1)
    float topGlow = 1.0 - smoothstep(0.0, 0.8, vUv2.y);

    vec3 base = mix(uColor, uGlowColor, clamp(topGlow * 0.7 + fresnel * 0.6, 0.0, 1.0));
    vec3 color = base + vRing * 0.3 * uGlowColor;

    float alpha = mix(0.25, 0.75, fresnel) * mix(0.6, 1.0, pulse) + topGlow * 0.25 + vRing * 0.15;
    alpha = clamp(alpha, 0.0, 0.9);

    gl_FragColor = vec4(color, alpha);
  }
`

function Tentacle({ color, length, baseRadius, phase, speed, swimRef }) {
  const segCount = 5
  const segLen = length / segCount
  const refs = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const swim = swimRef.current
    refs.current.forEach((seg, i) => {
      if (!seg) return
      const sway = Math.sin(t * speed + phase + i * 0.5) * (0.35 - i * 0.05)
      const slap =
        Math.pow(Math.max(0, Math.sin(t * speed + phase - i * 0.35)), 3) * swim * (0.4 + i * 0.15)
      seg.rotation.z = sway + slap
      seg.rotation.x = Math.cos(t * speed * 0.8 + phase + i * 0.5) * (0.25 - i * 0.03)
    })
  })

  let node = null
  for (let i = segCount - 1; i >= 0; i--) {
    const radiusTop = baseRadius * (1 - i / segCount)
    const radiusBottom = baseRadius * (1 - (i + 1) / segCount)
    node = (
      <group key={i} ref={(el) => (refs.current[i] = el)} position={[0, i === 0 ? 0 : -segLen, 0]}>
        <mesh position={[0, -segLen / 2, 0]}>
          <cylinderGeometry args={[radiusTop, radiusBottom, segLen, 5, 1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        {node}
      </group>
    )
  }

  return node
}

const JELLY_BANDS = [
  { y: -18, xRange: [-55, 55], zRange: [-65, -15] },
  { y: -36, xRange: [-60, 60], zRange: [-75, -10] },
  { y: -54, xRange: [-50, 50], zRange: [-70, -15] },
  { y: -70, xRange: [-60, 60], zRange: [-75, -10] },
]

function JellyfishOne({
  position,
  rotation,
  scale,
  phase,
  swimSpeed,
  palette,
  ringSpeed,
  ringAmp,
  tentacles,
}) {
  const cfg = useConfig()
  const { pulseSpeed } = cfg.jellyfish
  const { color, glow } = palette
  const groupRef = useRef()
  const domeRef = useRef()
  const coreRef = useRef()
  const swimRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulseSpeed: { value: pulseSpeed },
      uRingSpeed: { value: ringSpeed },
      uRingAmp: { value: ringAmp },
      uColor: { value: new THREE.Color(color) },
      uGlowColor: { value: new THREE.Color(glow) },
    }),
    []
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tp = t + phase

    const swim = Math.max(0, Math.sin(tp * swimSpeed))
    swimRef.current = swim

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(tp * 0.25) * 1.5 + swim * 0.6
      groupRef.current.rotation.y = rotation[1] + Math.sin(tp * 0.1) * 0.15
    }
    if (domeRef.current) {
      const squash = 1 - swim * 0.25
      domeRef.current.scale.set(1 + swim * 0.12, 0.6 * squash, 1 + swim * 0.12)
    }
    if (coreRef.current) {
      const beat = 0.7 + 0.3 * swim
      coreRef.current.scale.setScalar(beat)
    }

    uniforms.uTime.value = t
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh scale={[1.7, 1.0, 1.7]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={domeRef} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[1.2, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <shaderMaterial
          vertexShader={domeVertex}
          fragmentShader={domeFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={coreRef} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.4, 12, 10]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {tentacles.map((tt, i) => (
        <group key={i} position={[tt.x, -0.1, tt.z]}>
          <Tentacle
            color={glow}
            length={tt.length}
            baseRadius={0.05}
            phase={tt.phase}
            speed={tt.speed}
            swimRef={swimRef}
          />
        </group>
      ))}
    </group>
  )
}

export default function Jellyfish() {
  const cfg = useConfig()
  const { count, scale, palettes } = cfg.jellyfish
  const { getHalfWidth, aspect } = useVisibleBounds()

  const jellies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const band = JELLY_BANDS[i % JELLY_BANDS.length]
      const tentacleCount = 10
      const swimSpeed = rand(0.4, 0.7)
      const rimRadius = 1.0
      const z = rand(band.zRange[0], band.zRange[1])
      const maxX = getHalfWidth(z)
      const xMin = Math.max(band.xRange[0], -maxX)
      const xMax = Math.min(band.xRange[1], maxX)
      const x = xMin < xMax ? rand(xMin, xMax) : 0

      const tentacles = Array.from({ length: tentacleCount }, (_, ti) => {
        const angle = (ti / tentacleCount) * Math.PI * 2 + rand(-0.15, 0.15)
        const r = rimRadius * rand(0.85, 1.0)
        return {
          x: Math.cos(angle) * r,
          z: Math.sin(angle) * r,
          length: rand(2.2, 4.0),
          phase: rand(0, Math.PI * 2),
          speed: swimSpeed * rand(0.9, 1.1),
        }
      })

      return {
        position: [x, band.y + rand(-4, 4), z],
        rotation: [0, rand(-Math.PI, Math.PI), 0],
        scale: scale * rand(0.8, 1.4),
        phase: rand(0, Math.PI * 2),
        swimSpeed,
        ringSpeed: rand(1.0, 1.8),
        ringAmp: rand(0.08, 0.16),
        palette: palettes[i % palettes.length],
        tentacles,
      }
    })
  }, [count, scale, palettes, aspect])

  return (
    <group>
      {jellies.map((j, i) => (
        <JellyfishOne key={i} {...j} />
      ))}
    </group>
  )
}
