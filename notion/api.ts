export function getHeaders(accessToken: string): Headers {
  return new Headers([
    ["Authorization", "Bearer " + accessToken],
    ["Notion-Version", "2021-05-13"],
    ["Content-Type", "application/json"],
  ]);
}

export type Parent = DatabaseParent | PageParent;
export interface DatabaseParent {
  type: "database_id";
  database_id: string;
}
export interface PageParent {
  type: "page_id";
  page_id: string;
}
export async function createPage(
  headers: Headers,
  parent: Parent,
  properties: any,
  children: any[],
) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent,
      properties,
      children,
    }),
  });
  if (res.status >= 400) throw await res.json();
  return await res.json();
}
