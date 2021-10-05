import { Node } from "./types.ts";
import { matchNode } from "./matchNode.ts";

export function serializeImportRaw(path: string, nodes: Node[]) {
  const imports: string[] = [];
  for (const node of nodes) {
    if (!matchNode(path, node)) {
      continue;
    }
    if (node.importName === "*") {
      imports.push(node.importNameAs!);
    } else if (node.importNameAs) {
      imports.push(`${node.importName} as ${node.importNameAs}`);
    } else {
      imports.push(node.importName);
    }
  }
  if (imports.length === 0) return undefined;
  return `import { ${imports.join(", ")} } from "${path}";`;
}
