import type { Book } from "@/types";

/** Hardcoded book data — update here when details change. */
export function getBook(): Book {
  return {
    id: "book-1",
    title: "Agentic AI Demystified: Master the Essentials",
    description:
      "A simple-to-follow book to get started with your Agentic AI journey. Covers fundamentals like ReAct and CodeAct frameworks, advanced concepts like memory, tool calling, and evaluation, then hands-on building with Amazon Bedrock Agents, Langflow, LangGraph, and agent communication protocols like Anthropic's MCP and Google's A2A.",
    coverImage: "/book-cover.png",
    buyLink: "https://www.amazon.in/dp/B0FK9SL6KJ",
    highlights: [
      "ReAct & CodeAct frameworks explained simply",
      "Memory, tool calling, evaluation & agent design",
      "Build with Bedrock Agents, Langflow & LangGraph",
      "Deep dive into MCP and A2A protocols",
      "Real-world case studies, code examples & diagrams",
    ],
  };
}
