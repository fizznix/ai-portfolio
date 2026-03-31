"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Book } from "@/types";

export default function BookShowcase({ book }: { book: Book }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-8 md:flex-row md:gap-10"
    >
      {/* Cover */}
      <div className="relative h-[280px] w-[200px] sm:h-[360px] sm:w-[260px] shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            sizes="260px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900/50 to-cyan-900/50">
            <span className="text-5xl">📖</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-white">{book.title}</h2>
        <p className="mt-4 leading-relaxed text-gray-400">{book.description}</p>

        {book.highlights.length > 0 && (
          <ul className="mt-6 space-y-2">
            {book.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1 text-purple-400">▹</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <a
          href={book.buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          Get the Book →
        </a>
      </div>
    </motion.div>
  );
}
