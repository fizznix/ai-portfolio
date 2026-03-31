import { notion } from "./notion";
import type { Project } from "@/types";

export async function fetchProjects(): Promise<Project[]> {
  const dbId = process.env.NOTION_PROJECT_DB;
  if (!dbId) return [];

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
        description: props.Description?.rich_text?.[0]?.plain_text ?? "",
        tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
        status: props.Status?.select?.name ?? "Unknown",
        featured: props.Featured?.checkbox ?? false,
        order: props.Order?.number ?? 0,
        link: props.Link?.url ?? undefined,
      };
    });
  } catch {
    return [];
  }
}
