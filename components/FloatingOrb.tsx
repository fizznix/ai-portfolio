"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Particle Network ---------- */
function ParticleNetwork({ count = 200, radius = 5 }: { count?: number; radius?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * radius * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * radius * 2;
      pos[i3 + 2] = (Math.random() - 0.5) * radius * 2;
      vel[i3] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos, velocities: vel };
  }, [count, radius]);

  const linePositions = useMemo(() => new Float32Array(count * count * 0.1 * 6), [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Move particles
    for (let i = 0; i < count * 3; i++) {
      pos[i] += velocities[i];
      if (Math.abs(pos[i]) > radius) velocities[i] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Draw connections
    let lineIdx = 0;
    const maxConnections = linePositions.length / 6;
    const threshold = 1.8;
    for (let i = 0; i < count && lineIdx < maxConnections; i++) {
      for (let j = i + 1; j < count && lineIdx < maxConnections; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          const li = lineIdx * 6;
          linePositions[li] = pos[i * 3];
          linePositions[li + 1] = pos[i * 3 + 1];
          linePositions[li + 2] = pos[i * 3 + 2];
          linePositions[li + 3] = pos[j * 3];
          linePositions[li + 4] = pos[j * 3 + 1];
          linePositions[li + 5] = pos[j * 3 + 2];
          lineIdx++;
        }
      }
    }
    // Zero out unused
    for (let i = lineIdx * 6; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial color="#a855f7" size={0.03} transparent opacity={0.7} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

/* ---------- Central Morphing Core ---------- */
function MorphingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;

    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos);
    }

    const orig = originalPositions.current;
    for (let i = 0; i < pos.length; i += 3) {
      const ox = orig[i], oy = orig[i + 1], oz = orig[i + 2];
      const noise = Math.sin(ox * 2 + t * 0.8) * Math.cos(oy * 2 + t * 0.6) * Math.sin(oz * 2 + t * 0.7);
      const scale = 1 + noise * 0.15;
      pos[i] = ox * scale;
      pos[i + 1] = oy * scale;
      pos[i + 2] = oz * scale;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 4]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#7c3aed"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/* ---------- Orbital Rings ---------- */
function OrbitalRing({ radius = 2, speed = 0.3, tilt = 0, color = "#22d3ee" }: {
  radius?: number; speed?: number; tilt?: number; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = tilt;
    ref.current.rotation.y = clock.getElapsedTime() * speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.005, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

/* ---------- Exported Component ---------- */
export default function FloatingOrb() {
  return (
    <group>
      <MorphingCore />
      <OrbitalRing radius={2} speed={0.2} tilt={0.5} color="#22d3ee" />
      <OrbitalRing radius={2.5} speed={-0.15} tilt={-0.3} color="#a855f7" />
      <OrbitalRing radius={3} speed={0.1} tilt={0.8} color="#06b6d4" />
      <ParticleNetwork count={150} radius={6} />
    </group>
  );
}
