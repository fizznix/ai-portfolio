"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Container from "./Container";
import { useEffect, useState } from "react";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* 3D Background — desktop only */}
      {!isMobile && <SceneCanvas />}

      {/* Mobile gradient fallback */}
      {isMobile && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-950/40 via-black to-cyan-950/30" />
      )}

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="mb-4 font-mono text-xs sm:text-sm text-cyan-400">
            // AI Engineer
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Building intelligent
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              systems & experiences
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-gray-400">
            I design and build AI-powered products, infrastructure, and
            developer tools — from research to production.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <a
              href="/work"
              className="rounded-lg bg-purple-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
            >
              View Work
            </a>
            <a
              href="/blogs"
              className="rounded-lg border border-white/10 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-gray-300 backdrop-blur transition-colors hover:bg-white/10"
            >
              Read Blogs
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
