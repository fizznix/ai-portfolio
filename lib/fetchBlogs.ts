import { notion } from "./notion";
import type { Blog } from "@/types";

export async function fetchBlogs(): Promise<Blog[]> {
  const dbId = process.env.NOTION_BLOG_DB;
  if (!dbId) return [];

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Name?.title?.[0]?.plain_text ?? "Untitled",
        thumbnail: props.Thumbnail?.files?.[0]?.file?.url ??
          props.Thumbnail?.files?.[0]?.external?.url ?? "",
        link: props.Link?.url ?? "#",
        date: props.Date?.date?.start ?? "",
        tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      };
    });
  } catch {
    return [];
  }
}
