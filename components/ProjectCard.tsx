"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur transition-shadow hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {project.status && (
          <Badge
            variant="secondary"
            className={`text-xs ${
              project.status === "Live"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : project.status === "In Progress"
                ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 bg-white/5 text-gray-400"
            }`}
          >
            {project.status}
          </Badge>
        )}
        {project.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="border-white/10 bg-white/5 text-xs text-gray-400"
          >
            {tag}
          </Badge>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        {project.description}
      </p>
      {project.link && (
        <span className="mt-4 inline-block text-xs text-purple-400 transition-colors group-hover:text-purple-300">
          View project →
        </span>
      )}
    </motion.div>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return inner;
}
