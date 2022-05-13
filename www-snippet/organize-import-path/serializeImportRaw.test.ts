import { Node } from "./types.ts";
import { getImportRaw } from "./getImportRaw.ts";
import { parseImportRaw } from "./parseImportRaw.ts";
import { assertEquals } from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { serializeImportRaw } from "./serializeImportRaw.ts";

Deno.test(`serializeImportRaw`, () => {
  const content = `import Button from "@ABC/DS/Button";
import Card, { CardProps } from "@ABC/DS/Card";
  `;
  const nodes: Node[] = [];

  for (const importRaw of getImportRaw(content)) {
    nodes.push(...parseImportRaw(importRaw));
  }

  const result = serializeImportRaw("@ABC/DS", nodes);
  assertEquals(result, `import { Button, Card, CardProps } from "@ABC/DS";`);
});
