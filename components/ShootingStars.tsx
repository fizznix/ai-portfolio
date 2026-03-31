"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 8;
const TRAIL_LENGTH = 28;

interface Star {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  delay: number;
  brightness: number;
  trail: THREE.Vector3[];
}

function randomStar(): Star {
  // Random entry from edges of the viewport
  const side = Math.random();
  let x: number, y: number, z: number;
  let vx: number, vy: number;

  if (side < 0.5) {
    // Enter from top-right area
    x = THREE.MathUtils.randFloat(2, 12);
    y = THREE.MathUtils.randFloat(3, 8);
    vx = THREE.MathUtils.randFloat(-3, -1.5);
    vy = THREE.MathUtils.randFloat(-2.5, -0.8);
  } else {
    // Enter from top-left area
    x = THREE.MathUtils.randFloat(-12, -2);
    y = THREE.MathUtils.randFloat(3, 8);
    vx = THREE.MathUtils.randFloat(1.5, 3);
    vy = THREE.MathUtils.randFloat(-2.5, -0.8);
  }
  z = THREE.MathUtils.randFloat(-3, 1);

  const maxLife = THREE.MathUtils.randFloat(2.5, 5.0);

  return {
    position: new THREE.Vector3(x, y, z),
    velocity: new THREE.Vector3(vx, vy, 0),
    life: 0,
    maxLife,
    delay: THREE.MathUtils.randFloat(0, 8),
    brightness: THREE.MathUtils.randFloat(0.5, 1.0),
    trail: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(x, y, z)),
  };
}

export default function ShootingStars() {
  const pointsRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.LineSegments>(null);

  const stars = useRef<Star[]>(
    Array.from({ length: STAR_COUNT }, () => randomStar())
  );

  // Geometry for star heads (bright points)
  const headGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const alphas = new Float32Array(STAR_COUNT);
    const sizes = new Float32Array(STAR_COUNT);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  // Geometry for trails (line segments)
  const trailGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Each star has (TRAIL_LENGTH - 1) segments = 2 * (TRAIL_LENGTH - 1) vertices
    const vertCount = STAR_COUNT * (TRAIL_LENGTH - 1) * 2;
    const positions = new Float32Array(vertCount * 3);
    const alphas = new Float32Array(vertCount);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    return geo;
  }, []);

  const headMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {},
        vertexShader: /* glsl */ `
          attribute float alpha;
          attribute float size;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float glow = smoothstep(0.5, 0.0, d);
            vec3 color = mix(vec3(0.134, 0.827, 0.933), vec3(1.0), glow * glow);
            gl_FragColor = vec4(color, vAlpha * glow);
          }
        `,
      }),
    []
  );

  const trailMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {},
        vertexShader: /* glsl */ `
          attribute float alpha;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            vec3 color = mix(vec3(0.486, 0.228, 0.933), vec3(0.134, 0.827, 0.933), vAlpha);
            gl_FragColor = vec4(color, vAlpha * 0.6);
          }
        `,
      }),
    []
  );

  useFrame((_, delta) => {
    const headPos = headGeometry.attributes.position as THREE.BufferAttribute;
    const headAlpha = headGeometry.attributes.alpha as THREE.BufferAttribute;
    const headSize = headGeometry.attributes.size as THREE.BufferAttribute;
    const trailPos = trailGeometry.attributes.position as THREE.BufferAttribute;
    const trailAlpha = trailGeometry.attributes.alpha as THREE.BufferAttribute;

    stars.current.forEach((star, i) => {
      // Handle delay
      if (star.delay > 0) {
        star.delay -= delta;
        headAlpha.array[i] = 0;
        headSize.array[i] = 0;
        // Zero out trail
        const segPerStar = (TRAIL_LENGTH - 1) * 2;
        for (let j = 0; j < segPerStar; j++) {
          const idx = i * segPerStar + j;
          trailAlpha.array[idx] = 0;
        }
        return;
      }

      star.life += delta;

      if (star.life > star.maxLife) {
        // Respawn
        const fresh = randomStar();
        Object.assign(star, fresh);
        return;
      }

      const progress = star.life / star.maxLife;

      // Move
      star.position.addScaledVector(star.velocity, delta);

      // Update trail (shift and add current pos)
      for (let t = TRAIL_LENGTH - 1; t > 0; t--) {
        star.trail[t].copy(star.trail[t - 1]);
      }
      star.trail[0].copy(star.position);

      // Fade: bright in middle, fade at start and end
      const fade = progress < 0.15
        ? progress / 0.15
        : progress > 0.7
          ? (1 - progress) / 0.3
          : 1.0;

      // Head
      headPos.array[i * 3] = star.position.x;
      headPos.array[i * 3 + 1] = star.position.y;
      headPos.array[i * 3 + 2] = star.position.z;
      headAlpha.array[i] = fade * star.brightness;
      headSize.array[i] = 0.25 * star.brightness;

      // Trail segments
      const segPerStar = (TRAIL_LENGTH - 1) * 2;
      for (let t = 0; t < TRAIL_LENGTH - 1; t++) {
        const idx = (i * segPerStar + t * 2) * 3;
        const a = star.trail[t];
        const b = star.trail[t + 1];
        trailPos.array[idx] = a.x;
        trailPos.array[idx + 1] = a.y;
        trailPos.array[idx + 2] = a.z;
        trailPos.array[idx + 3] = b.x;
        trailPos.array[idx + 4] = b.y;
        trailPos.array[idx + 5] = b.z;

        const trailFade = (1 - t / (TRAIL_LENGTH - 1)) * fade * star.brightness;
        const alphaIdx = i * segPerStar + t * 2;
        trailAlpha.array[alphaIdx] = trailFade;
        trailAlpha.array[alphaIdx + 1] = trailFade * 0.3;
      }
    });

    headPos.needsUpdate = true;
    headAlpha.needsUpdate = true;
    headSize.needsUpdate = true;
    trailPos.needsUpdate = true;
    trailAlpha.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef} geometry={headGeometry} material={headMaterial} />
      <lineSegments ref={trailRef} geometry={trailGeometry} material={trailMaterial} />
    </group>
  );
}
