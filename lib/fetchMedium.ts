export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string | null;
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1] ?? null;
}

function extractItems(xml: string): MediumPost[] {
  const items: MediumPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      ?? block.match(/<title>(.*?)<\/title>/)?.[1]
      ?? "Untitled";
    const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? "#";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
    const content = block.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] ?? "";
    const thumbnail = extractFirstImage(content);

    items.push({ title, link, pubDate, thumbnail });
  }

  return items;
}

export async function fetchMediumPosts(
  limit = 10,
): Promise<MediumPost[]> {
  const url = "https://medium.com/feed/@nixonkurian.nk";

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const posts = extractItems(xml).slice(0, limit);

    return posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );
  } catch {
    return [];
  }
}
