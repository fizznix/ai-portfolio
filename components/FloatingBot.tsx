"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function FloatingBot() {
  const botRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 80, y: 80 });
  const velRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 200, y: 200 });
  const [renderPos, setRenderPos] = useState({ x: 80, y: 80 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [bobPhase, setBobPhase] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const wanderTimer = useRef(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const modeRef = useRef<"wander" | "drag" | "thrown">("wander");

  // Track mouse position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      prevMouse.current = { ...lastMouse.current };
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setMouse({ x: e.clientX, y: e.clientY });

      if (modeRef.current === "drag") {
        posRef.current = {
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        };
      }
    };

    const handleUp = () => {
      if (modeRef.current === "drag") {
        // Calculate throw velocity from recent mouse movement
        const throwVx = (lastMouse.current.x - prevMouse.current.x) * 0.8;
        const throwVy = (lastMouse.current.y - prevMouse.current.y) * 0.8;
        velRef.current = { x: throwVx, y: throwVy };
        modeRef.current = "thrown";
        setIsDragging(false);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = botRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    velRef.current = { x: 0, y: 0 };
    modeRef.current = "drag";
    setIsDragging(true);
  }, []);

  // Pick a new random wander target
  const pickTarget = useCallback(() => {
    const padding = 80;
    targetRef.current = {
      x: padding + Math.random() * (window.innerWidth - padding * 2),
      y: padding + Math.random() * (window.innerHeight - padding * 2),
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;
      timeRef.current += 0.02;

      const mode = modeRef.current;
      const p = posRef.current;
      const v = velRef.current;

      if (mode === "wander") {
        wanderTimer.current += 1;
        if (wanderTimer.current > 240) {
          wanderTimer.current = 0;
          pickTarget();
        }
        const t = targetRef.current;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        p.x += dx * 0.008;
        p.y += dy * 0.008;
      } else if (mode === "thrown") {
        // Apply velocity with friction
        p.x += v.x;
        p.y += v.y;
        v.x *= 0.96;
        v.y *= 0.96;

        // Bounce off edges
        const w = window.innerWidth - 56;
        const h = window.innerHeight - 56;
        if (p.x < 0) { p.x = 0; v.x = Math.abs(v.x) * 0.6; }
        if (p.x > w) { p.x = w; v.x = -Math.abs(v.x) * 0.6; }
        if (p.y < 0) { p.y = 0; v.y = Math.abs(v.y) * 0.6; }
        if (p.y > h) { p.y = h; v.y = -Math.abs(v.y) * 0.6; }

        // Once velocity is low enough, resume wandering
        if (Math.abs(v.x) < 0.3 && Math.abs(v.y) < 0.3) {
          modeRef.current = "wander";
          wanderTimer.current = 200; // pick new target soon
        }
      }
      // "drag" mode: position is set directly by mousemove handler

      setRenderPos({ x: p.x, y: p.y });
      setBobPhase(timeRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [pickTarget]);

  // Calculate eye direction toward mouse
  const eyeOffset = (eyeCenterX: number, eyeCenterY: number) => {
    const botRect = botRef.current?.getBoundingClientRect();
    if (!botRect) return { x: 0, y: 0 };

    const eyeWorldX = botRect.left + eyeCenterX;
    const eyeWorldY = botRect.top + eyeCenterY;
    const dx = mouse.x - eyeWorldX;
    const dy = mouse.y - eyeWorldY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = 3.5;
    const factor = Math.min(maxOffset, dist * 0.02);

    return {
      x: dist > 0 ? (dx / dist) * factor : 0,
      y: dist > 0 ? (dy / dist) * factor : 0,
    };
  };

  const bobY = isDragging ? 0 : Math.sin(bobPhase * 1.5) * 6;
  const tilt = isDragging ? 0 : Math.sin(bobPhase * 0.8) * 3;
  const leftEye = eyeOffset(18, 22);
  const rightEye = eyeOffset(38, 22);

  return (
    <div
      ref={botRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); }}
      onMouseDown={handleMouseDown}
      className="fixed z-[9999] pointer-events-auto select-none"
      style={{
        left: renderPos.x,
        top: renderPos.y + bobY,
        cursor: isDragging ? "grabbing" : "grab",
        transform: `rotate(${tilt}deg) scale(${isDragging ? 1.3 : isHovered ? 1.2 : 1})`,
        transition: isDragging ? "none" : "transform 0.3s ease",
        filter: `drop-shadow(0 0 ${isDragging ? 20 : isHovered ? 16 : 8}px rgba(168,85,247,${isDragging ? 0.9 : 0.6}))`,
      }}
      title="Grab me and throw! 🤖"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        <line
          x1="28"
          y1="8"
          x2="28"
          y2="2"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="1.5" r="2" fill="#22d3ee">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Head body */}
        <rect
          x="8"
          y="10"
          width="40"
          height="30"
          rx="10"
          fill="#1a1a2e"
          stroke="#a855f7"
          strokeWidth="1.5"
        />

        {/* Visor / face plate */}
        <rect
          x="12"
          y="14"
          width="32"
          height="18"
          rx="6"
          fill="#0f0f23"
          stroke="#22d3ee"
          strokeWidth="0.8"
          opacity="0.8"
        />

        {/* Left eye white */}
        <ellipse cx="21" cy="23" rx="5" ry="5.5" fill="#1e1e3a" />
        {/* Left pupil */}
        <circle
          cx={21 + leftEye.x}
          cy={23 + leftEye.y}
          r="2.5"
          fill="#22d3ee"
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Left eye highlight */}
        <circle
          cx={19.5 + leftEye.x * 0.5}
          cy={21.5 + leftEye.y * 0.5}
          r="0.8"
          fill="white"
          opacity="0.8"
        />

        {/* Right eye white */}
        <ellipse cx="35" cy="23" rx="5" ry="5.5" fill="#1e1e3a" />
        {/* Right pupil */}
        <circle
          cx={35 + rightEye.x}
          cy={23 + rightEye.y}
          r="2.5"
          fill="#22d3ee"
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Right eye highlight */}
        <circle
          cx={33.5 + rightEye.x * 0.5}
          cy={21.5 + rightEye.y * 0.5}
          r="0.8"
          fill="white"
          opacity="0.8"
        />

        {/* Mouth — changes with state */}
        {isDragging ? (
          /* Open mouth — surprised/excited */
          <ellipse
            cx="28"
            cy="31"
            rx="4"
            ry="3"
            fill="#0f0f23"
            stroke="#a855f7"
            strokeWidth="1.2"
          />
        ) : modeRef.current === "thrown" && (Math.abs(velRef.current.x) > 2 || Math.abs(velRef.current.y) > 2) ? (
          /* Dizzy wavy mouth while flying fast */
          <path
            d="M21 31 Q24 29 26 31 Q28 33 30 31 Q32 29 35 31"
            stroke="#a855f7"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        ) : isHovered ? (
          <path
            d="M22 30 Q28 35 34 30"
            stroke="#a855f7"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1="23"
            y1="31"
            x2="33"
            y2="31"
            stroke="#a855f7"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}

        {/* Ears / side panels */}
        <rect
          x="3"
          y="18"
          width="5"
          height="12"
          rx="2"
          fill="#1a1a2e"
          stroke="#a855f7"
          strokeWidth="1"
        />
        <rect
          x="48"
          y="18"
          width="5"
          height="12"
          rx="2"
          fill="#1a1a2e"
          stroke="#a855f7"
          strokeWidth="1"
        />

        {/* Body / neck */}
        <rect
          x="20"
          y="40"
          width="16"
          height="8"
          rx="3"
          fill="#1a1a2e"
          stroke="#a855f7"
          strokeWidth="1"
        />

        {/* Chest light */}
        <circle cx="28" cy="44" r="2" fill="#a855f7" opacity="0.8">
          <animate
            attributeName="r"
            values="1.5;2.5;1.5"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Little feet */}
        <rect
          x="18"
          y="48"
          width="8"
          height="4"
          rx="2"
          fill="#1a1a2e"
          stroke="#22d3ee"
          strokeWidth="0.8"
        />
        <rect
          x="30"
          y="48"
          width="8"
          height="4"
          rx="2"
          fill="#1a1a2e"
          stroke="#22d3ee"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
