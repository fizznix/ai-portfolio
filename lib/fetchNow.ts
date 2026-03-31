import { notion } from "./notion";
import type { NowItem } from "@/types";

export async function fetchNow(): Promise<NowItem[]> {
  const dbId = process.env.NOTION_NOW_DB;
  if (!dbId) return [];

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Active",
        checkbox: { equals: true },
      },
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        text: props.Text?.title?.[0]?.plain_text ?? "",
        active: props.Active?.checkbox ?? false,
      };
    });
  } catch {
    return [];
  }
}
