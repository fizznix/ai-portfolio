"use client";

import { useMemo } from "react";

interface MessageBubbleProps {
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
}

/** Split text into plain segments and clickable URLs */
const URL_RE = /(https?:\/\/[^\s)]+)/g;

function renderWithLinks(text: string) {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    URL_RE.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 underline decoration-cyan-400/40 hover:decoration-cyan-400 transition-colors break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function MessageBubble({
  role,
  content,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const rendered = useMemo(() => (isUser ? content : renderWithLinks(content)), [content, isUser]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "bg-purple-600 text-white"
            : "border border-white/10 bg-white/5 text-gray-200"
        }`}
      >
        {!isUser && (
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-purple-400">
            AI Assistant
          </span>
        )}
        <div className="whitespace-pre-wrap">{rendered}</div>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-purple-400" />
        )}
      </div>
    </div>
  );
}
