import { fetchProjects } from "./fetchProjects";
import { fetchMediumPosts } from "./fetchMedium";
import { getBook } from "./fetchBook";
import { fetchNow } from "./fetchNow";

export interface ContextChunk {
  type: "project" | "blog" | "book" | "now" | "contact";
  title: string;
  text: string;
  url?: string;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
}

export async function buildContext(): Promise<ContextChunk[]> {
  const [projects, posts, nowItems] = await Promise.all([
    fetchProjects(),
    fetchMediumPosts(6),
    fetchNow(),
  ]);
  const book = getBook();

  const chunks: ContextChunk[] = [];

  // Projects (up to 6)
  for (const p of projects.slice(0, 6)) {
    chunks.push({
      type: "project",
      title: p.title,
      url: p.link,
      text: truncate(
        `Project: "${p.title}" — ${p.description}. Tags: ${p.tags.join(", ")}. Status: ${p.status}.${p.link ? ` Link: ${p.link}` : ""}`,
        500,
      ),
    });
  }

  // Blog posts (up to 4)
  for (const b of posts.slice(0, 4)) {
    const date = b.pubDate
      ? new Date(b.pubDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "";
    chunks.push({
      type: "blog",
      title: b.title,
      url: b.link,
      text: truncate(
        `Blog: "${b.title}" — Published ${date}. Read at: ${b.link}`,
        400,
      ),
    });
  }

  // Book
  chunks.push({
    type: "book",
    title: book.title,
    url: book.buyLink,
    text: truncate(
      `Book: "${book.title}" — ${book.description} Key highlights: ${book.highlights.join("; ")}. Buy: ${book.buyLink}`,
      600,
    ),
  });

  // Now items
  if (nowItems.length > 0) {
    chunks.push({
      type: "now",
      title: "Current Activities",
      text: `Currently: ${nowItems.map((n) => n.text).join("; ")}`,
    });
  }

  // Contact / Socials
  chunks.push({
    type: "contact",
    title: "Contact & Socials",
    url: "https://www.linkedin.com/in/nixonkurian/",
    text: `Contact Nixon: LinkedIn — https://www.linkedin.com/in/nixonkurian/ | X (Twitter) — https://x.com/kuriannixon | Email — nixonkurian.nk@gmail.com. To reach out, connect, collaborate, hire, or get in touch with Nixon, use any of these channels.`,
  });

  return chunks;
}
