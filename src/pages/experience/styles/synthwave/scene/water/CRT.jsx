import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { ocean } from './ocean'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'

const { SAND_MESH_Y } = ocean

const CrtStaticMaterial = shaderMaterial(
  {
    uTime: 0,
    uOffset: [0, 0],
    uColorA: '#ff00ff',
    uColorB: '#00ffe1',
    uCurve: 0.05,
  },
  /* vertex */ `
    varying vec2 vUv;
    uniform float uCurve;
    void main() {
      vUv = uv;
      vec3 pos = position;
      vec2 centered = uv - 0.5;
      float d = dot(centered, centered);
      pos.z += uCurve * (1.0 - d * 4.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uTime;
    uniform vec2 uOffset;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 3; i++) {
        v += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 p = (vUv + uOffset) * 3.0 + uTime * 0.05;
      float field = fbm(p);
      float grain = hash(vUv * 500.0 + uTime * 60.0 + uOffset * 91.0);
      float v = mix(grain, field, 0.35);
      vec3 color = mix(uColorA, uColorB, v);
      gl_FragColor = vec4(color * (0.4 + 0.6 * v), 1.0);
    }
  `
)

extend({ CrtStaticMaterial })

function CRTUnit({ bodyColor, colorA, colorB }) {
  const matRef = useRef()
  const colorAVec = useMemo(() => new THREE.Color(colorA), [colorA])
  const colorBVec = useMemo(() => new THREE.Color(colorB), [colorB])

  const { width, height, depth, position, rotationY, offset, curve } = useMemo(() => {
    const w = 1.2 + Math.random() * 1.4
    const h = 1.0 + Math.random() * 1.2
    const pos = [
      (Math.random() - 0.5) * 40,
      SAND_MESH_Y + 12 + Math.random() * 8,
      -5 - Math.random() * 20,
    ]
    return {
      width: w,
      height: h,
      depth: 0.9 + Math.random() * 0.4,
      position: pos,
      rotationY: Math.atan2(-pos[0], -pos[2]) + (Math.random() - 0.5) * 0.6,
      offset: [Math.random() * 10, Math.random() * 10],
      curve: 0.12 * Math.min(w, h),
    }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.elapsedTime
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width - 0.28, height - 0.28, 12, 12]} />
        <crtStaticMaterial
          ref={matRef}
          uOffset={offset}
          uColorA={colorAVec}
          uColorB={colorBVec}
          uCurve={curve}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function CRTField() {
  const cfg = useConfig()
  const { count, bodyColor, screenColorA, screenColorB } = cfg.water.crt

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <CRTUnit key={i} bodyColor={bodyColor} colorA={screenColorA} colorB={screenColorB} />
      ))}
    </group>
  )
}
