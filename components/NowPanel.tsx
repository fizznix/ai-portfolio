"use client";

import { motion } from "framer-motion";
import type { NowItem } from "@/types";

export default function NowPanel({ items }: { items: NowItem[] }) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] font-mono backdrop-blur"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-gray-500">~/now</span>
      </div>

      {/* Content */}
      <div className="p-5 text-sm leading-relaxed">
        <p className="mb-3 text-cyan-400">$ cat now.txt</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="text-gray-300">
              <span className="text-purple-400">→</span> {item.text}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600">
          <span className="animate-pulse">▊</span>
        </p>
      </div>
    </motion.div>
  );
}
