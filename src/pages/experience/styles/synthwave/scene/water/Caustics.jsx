// src/styles/synthwave/water/Caustics.jsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useConfig } from '@/pages/experience/styles/synthwave/useConfig'
import * as THREE from 'three'
import { ocean } from './ocean'

const { WIDTH, DEPTH, WATER_MESH_Y } = ocean

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uEdgeWidth;
  uniform float uIntensity;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec2  vUv;

  // Hash for pseudo-random
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  // Voronoi — returns (dist_to_edge, cell_id_hash)
  vec2 voronoi(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float minDist = 8.0;
    float minDist2 = 8.0;
    vec2  minCell = vec2(0.0);

    for (int x = -2; x <= 2; x++) {
      for (int y = -2; y <= 2; y++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = hash2(i + neighbor);
        // animate cell centers
        point = 0.5 + 0.5 * sin(uTime * uSpeed + 6.28318 * point);
        vec2 diff = neighbor + point - f;
        float d = length(diff);
        if (d < minDist) {
          minDist2 = minDist;
          minDist  = d;
          minCell  = point;
        } else if (d < minDist2) {
          minDist2 = d;
        }
      }
    }
    // edge distance = difference between nearest and second nearest
    return vec2(minDist2 - minDist, dot(minCell, vec2(7.0, 113.0)));
  }

  void main() {
    vec2 uv = vUv * uScale;

    // two layers at different scales + speeds
    vec2 v1 = voronoi(uv + uTime * uSpeed * 0.3);
    vec2 v2 = voronoi(uv * 1.7 - uTime * uSpeed * 0.17);

    // hard edge — step gives the low-poly sharp look
    float edge1 = 1.0 - step(uEdgeWidth, v1.x);
    float edge2 = 1.0 - step(uEdgeWidth * 0.8, v2.x);

    // color per layer using cell hash
    float t1 = fract(v1.y * 0.1);
    float t2 = fract(v2.y * 0.1);
    vec3 col1 = mix(uColorA, uColorB, step(0.5, t1));
    vec3 col2 = mix(uColorB, uColorA, step(0.5, t2));

    // combine layers
    vec3 color = col1 * edge1 + col2 * edge2 * 0.6;
    float alpha = (edge1 + edge2 * 0.6) * uIntensity;

    // radial fade so edges don't hard-clip
    vec2 centered = vUv - 0.5;
    float fade = 1.0 - smoothstep(0.3, 0.5, length(centered));
    alpha *= fade;

    gl_FragColor = vec4(color, alpha);
  }
`

export function Caustics() {
  const cfg = useConfig()
  const meshRef = useRef()
  const { scale, speed, edgeWidth, intensity, colorA, colorB } = cfg.water.caustics

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: scale },
      uSpeed: { value: speed },
      uEdgeWidth: { value: edgeWidth },
      uIntensity: { value: intensity },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const u = meshRef.current.material.uniforms
    u.uTime.value = clock.getElapsedTime()
    u.uScale.value = scale
    u.uSpeed.value = speed
    u.uEdgeWidth.value = edgeWidth
    u.uIntensity.value = intensity
    u.uColorA.value.set(colorA)
    u.uColorB.value.set(colorB)
  })

  return (
    <mesh ref={meshRef} position={[0, WATER_MESH_Y - 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[WIDTH, DEPTH]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
