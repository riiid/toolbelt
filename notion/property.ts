export function toProperties(schema: PropertySchema, data: any): any {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    const fieldSchema = schema[key];
    if (!fieldSchema) continue;
    result[key] = toPropertyTable[fieldSchema.type](
      value,
      fieldSchema as any,
    );
  }
  return result;
}
const toPropertyTable: {
  [type in FieldSchema["type"]]: (
    value: any,
    fieldSchema: Extract<FieldSchema, { type: type }>,
  ) => any;
} = {
  "title": (value) => {
    const content = value.toString();
    return { title: [{ text: { content } }] };
  },
  "rich_text": (value) => {
    const content = value.toString();
    return { title: [{ text: { content } }] };
  },
  "select": (value, fieldSchema) => {
    const names = fieldSchema.select.options.map(({ name }) => name);
    if (!names.includes(value)) throw new Error("invalid select value");
    return { select: { name: value } };
  },
  "date": (value) => {
    if (typeof value !== "string") throw new Error("value is not string");
    const [year, month, day] = value.trim().split(/\s*[-.]\s*/).map((v) => +v);
    const pad2 = (v: number) => v.toString().padStart(2, "0");
    const start = `${year}-${pad2(month)}-${pad2(day)}`;
    return { date: { start } };
  },
  "url": (value) => {
    const url = value.toString();
    return { url };
  },
};

export interface PropertySchema {
  [name: string]: FieldSchema;
}
export type FieldSchema = Title | RichText | Select | Date | Url;
export interface Title {
  type: "title";
  title: {};
}
export interface RichText {
  type: "rich_text";
  rich_text: {};
}
export interface Select {
  type: "select";
  select: {
    options: { name: string; color?: string }[];
  };
}
export interface Date {
  type: "date";
  date: {};
}
export interface Url {
  type: "url";
  url: {};
}
