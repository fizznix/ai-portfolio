"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Perspective grid that pulses and scrolls — gives depth to the scene */
export default function GridBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#7c3aed") },
        uColor2: { value: new THREE.Color("#06b6d4") },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;

        float grid(vec2 st, float res) {
          vec2 g = fract(st * res);
          return step(0.95, g.x) + step(0.95, g.y);
        }

        void main() {
          vec2 uv = vUv;
          // Scroll the grid
          uv.y += uTime * 0.02;

          float g = grid(uv, 20.0) * 0.3 + grid(uv, 10.0) * 0.15;
          // Fade at edges
          float fade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y)
                     * smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
          // Color gradient
          vec3 col = mix(uColor1, uColor2, vUv.x + sin(uTime * 0.3) * 0.2);
          // Pulse
          float pulse = 0.7 + 0.3 * sin(uTime * 0.5);
          gl_FragColor = vec4(col * g * fade * pulse, g * fade * 0.12);
        }
      `,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, -2.5, -4]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={mat}
        attach="material"
        args={[shader]}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
