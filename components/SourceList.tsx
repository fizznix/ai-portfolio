"use client";

export interface SourceItem {
  label: string;
  url?: string;
}

interface SourceListProps {
  sources: SourceItem[];
}

export default function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((s, i) => {
        const isProject = s.label.startsWith("Project:");
        const isBlog = s.label.startsWith("Blog:");
        const isBook = s.label.startsWith("Book:");
        const isContact = ["LinkedIn", "X (Twitter)", "Email"].includes(s.label);

        const color = isProject
          ? "border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60 hover:bg-cyan-500/10"
          : isBlog
            ? "border-purple-500/30 text-purple-400 hover:border-purple-500/60 hover:bg-purple-500/10"
            : isBook
              ? "border-amber-500/30 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/10"
              : isContact
                ? "border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                : "border-white/20 text-gray-400";

        const baseClasses = `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${color}`;

        if (s.url) {
          return (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} cursor-pointer`}
            >
              {s.label}
              <svg
                className="h-2.5 w-2.5 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          );
        }

        return (
          <span key={i} className={baseClasses}>
            {s.label}
          </span>
        );
      })}
    </div>
  );
}
