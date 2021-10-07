import { Node } from "./types.ts";

export function matchNode(path: string, node: Node) {
  return node.importPath.startsWith(path) && node.importPath !== path;
}
