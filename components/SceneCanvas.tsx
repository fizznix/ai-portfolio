"use client";

import { Canvas } from "@react-three/fiber";
import FloatingOrb from "./FloatingOrb";
import GridBackground from "./GridBackground";
import ShootingStars from "./ShootingStars";

export default function SceneCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#a855f7" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#22d3ee" />
        <pointLight position={[0, -5, -5]} intensity={0.3} color="#06b6d4" />
        <FloatingOrb />
        <GridBackground />
        <ShootingStars />
      </Canvas>
    </div>
  );
}
