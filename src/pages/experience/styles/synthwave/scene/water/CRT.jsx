import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial, useCursor, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ocean } from './ocean'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import { useStyleStore } from '@/pages/experience/store/useStyleStore'
import { useContent } from '@/hooks/useContent'
import githubIconUrl from '@/assets/icons/github.svg'
import linkedinIconUrl from '@/assets/icons/linkedin.svg'

const { SAND_MESH_Y } = ocean

const CrtStaticMaterial = shaderMaterial(
  {
    uTime: 0,
    uOffset: [0, 0],
    uColorA: '#ff00ff',
    uColorB: '#00ffe1',
    uBoost: 0,
  },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uTime;
    uniform vec2 uOffset;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uBoost;
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
      gl_FragColor = vec4(color * (0.4 + 0.6 * v) * (1.0 + uBoost), 1.0);
    }
  `
)

// SMPTE-style color bars for the "test pattern" gimmick.
const CrtBarsMaterial = shaderMaterial(
  {},
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    varying vec2 vUv;
    void main() {
      float x = vUv.x;
      vec3 color = vec3(0.0);
      if (x < 1.0 / 7.0) color = vec3(0.75);
      else if (x < 2.0 / 7.0) color = vec3(0.75, 0.75, 0.0);
      else if (x < 3.0 / 7.0) color = vec3(0.0, 0.75, 0.75);
      else if (x < 4.0 / 7.0) color = vec3(0.0, 0.75, 0.0);
      else if (x < 5.0 / 7.0) color = vec3(0.75, 0.0, 0.75);
      else if (x < 6.0 / 7.0) color = vec3(0.75, 0.0, 0.0);
      else color = vec3(0.0, 0.0, 0.75);
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// Soft-edged rectangular light cone for the underwater "shine" — night mode only.
const CrtBeamMaterial = shaderMaterial(
  { uColor: new THREE.Color('#ff00ff'), uOpacity: 0.35 },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      float edgeFade = sin(vUv.x * 3.14159265);
      float lengthFade = 1.0 - vUv.y * 0.7;
      float alpha = edgeFade * lengthFade * uOpacity;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
)

extend({ CrtStaticMaterial, CrtBarsMaterial, CrtBeamMaterial })

// Truncated rectangular pyramid: near face = nearW x nearH at z=0,
// far face = farW x farH at z=length. Side walls only (open near/far ends).
function frustumGeometry(nearW, nearH, farW, farH, length) {
  const nw = nearW / 2,
    nh = nearH / 2
  const fw = farW / 2,
    fh = farH / 2
  const nearPts = [
    [-nw, -nh, 0],
    [nw, -nh, 0],
    [nw, nh, 0],
    [-nw, nh, 0],
  ]
  const farPts = [
    [-fw, -fh, length],
    [fw, -fh, length],
    [fw, fh, length],
    [-fw, fh, length],
  ]
  const positions = []
  const uvs = []
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const a = nearPts[i],
      b = nearPts[j],
      c = farPts[j],
      d = farPts[i]
    positions.push(...a, ...b, ...c)
    uvs.push(0, 0, 1, 0, 1, 1)
    positions.push(...a, ...c, ...d)
    uvs.push(0, 0, 1, 1, 0, 1)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geo.computeVertexNormals()
  return geo
}

function useManualTexture(url) {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let mounted = true
    const loader = new THREE.TextureLoader()
    loader.load(url, (t) => {
      if (mounted) setTex(t)
    })
    return () => {
      mounted = false
    }
  }, [url])
  return tex
}

function CRTUnit({ bodyColor, colorA, colorB }) {
  const matRef = useRef()
  const groupRef = useRef()
  const beamRef = useRef()
  const isDark = useStyleStore((s) => s.isDark)
  const content = useContent()

  const colorAVec = useMemo(() => new THREE.Color(colorA), [colorA])
  const colorBVec = useMemo(() => new THREE.Color(colorB), [colorB])

  const { width, height, depth, position, rotationY, offset, bobSpeed, bobAmount, bobPhase } =
    useMemo(() => {
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
        rotationY: Math.atan2(-pos[0], -pos[2]) + (Math.random() - 0.5) * 1.4,
        offset: [Math.random() * 10, Math.random() * 10],
        bobSpeed: 0.3 + Math.random() * 0.2,
        bobAmount: 0.15 + Math.random() * 0.15,
        bobPhase: Math.random() * Math.PI * 2,
      }
    }, [])

  const beamLength = Math.max(width, height) * 2.5
  const beamGeo = useMemo(
    () => frustumGeometry(width, height, width * 2, height * 2, beamLength),
    [width, height, beamLength]
  )

  // Random per-TV gimmick: half show a test pattern on tap, half link out to socials.
  const { gimmick, socialType } = useMemo(
    () => ({
      gimmick: Math.random() < 0.5 ? 'test' : 'social',
      socialType: Math.random() < 0.5 ? 'github' : 'linkedin',
    }),
    []
  )
  const socialUrl = socialType === 'github' ? content.contact.github : content.contact.linkedin
  const socialLabel = socialType === 'github' ? 'GitHub' : 'LinkedIn'
  const githubTex = useManualTexture(githubIconUrl)
  const linkedinTex = useManualTexture(linkedinIconUrl) //useMemo(() => buildLinkedInTexture(), [])
  const iconTex = socialType === 'github' ? githubTex : linkedinTex

  const [hovered, setHovered] = useState(false)
  const [testActive, setTestActive] = useState(false)
  const pulseRef = useRef(0)
  const kickRef = useRef(0)
  const kickDirRef = useRef(1)
  useCursor(hovered)

  useEffect(() => {
    if (!testActive) return
    const id = setTimeout(() => setTestActive(false), 2500)
    return () => clearTimeout(id)
  }, [testActive])

  const handleClick = () => {
    if (gimmick === 'test') {
      setTestActive(true)
      pulseRef.current = 1
    } else {
      pulseRef.current = 1
      kickDirRef.current = Math.sign(position[0]) || 1
      kickRef.current = 1
      window.open(socialUrl, '_blank', 'noopener,noreferrer')
    }
  }

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    pulseRef.current = Math.max(0, pulseRef.current - delta * 2.5)
    kickRef.current = Math.max(0, kickRef.current - delta * 3)
    const boost = (hovered ? 0.35 : 0) + pulseRef.current

    if (matRef.current) {
      matRef.current.uTime = t
      matRef.current.uBoost = boost
    }
    if (groupRef.current) {
      const kick = Math.sin(kickRef.current * Math.PI) * kickRef.current * 0.6 * kickDirRef.current
      groupRef.current.position.y = position[1] + Math.sin(t * bobSpeed + bobPhase) * bobAmount
      groupRef.current.position.x = position[0] + kick
    }
    if (beamRef.current) {
      beamRef.current.uOpacity =
        0.22 + Math.abs(Math.sin(t * bobSpeed * 1.5 + bobPhase)) * 0.2 + boost * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh
        position={[0, 0, depth / 2 + 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[width - 0.28, height - 0.28]} />
        {testActive ? (
          <crtBarsMaterial toneMapped={false} />
        ) : (
          <crtStaticMaterial
            ref={matRef}
            uOffset={offset}
            uColorA={colorAVec}
            uColorB={colorBVec}
            toneMapped={false}
          />
        )}
      </mesh>
      {isDark && (
        <mesh position={[0, 0, depth / 2 + 0.02]} geometry={beamGeo}>
          <crtBeamMaterial
            ref={beamRef}
            uColor={colorAVec.clone().lerp(colorBVec, 0.5)}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
      {gimmick === 'social' && hovered && (
        <Html position={[0, height / 2 + 0.25, depth / 2]} center distanceFactor={8} occlude>
          <div
            style={{
              background: 'rgba(20, 4, 34, 0.85)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {'>_'} {socialLabel}
          </div>
        </Html>
      )}
      {gimmick === 'social' && iconTex && (
        <mesh position={[0, 0, depth / 2 + 0.015]}>
          <planeGeometry args={[(width - 0.28) * 0.4, (width - 0.28) * 0.4]} />
          <meshBasicMaterial map={iconTex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      )}
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
