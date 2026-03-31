"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { MediumPost } from "@/lib/fetchMedium";

export default function BlogCard({ post }: { post: MediumPost }) {
  const formattedDate = post.pubDate
    ? new Date(post.pubDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900/40 to-cyan-900/40">
              <span className="text-3xl">📝</span>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          {formattedDate && (
            <span className="mb-2 block text-xs text-gray-500">
              {formattedDate}
            </span>
          )}
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">
            {post.title}
          </h3>
        </div>
      </motion.div>
    </a>
  );
}
