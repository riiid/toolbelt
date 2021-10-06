import { Node } from "./types.ts";

export function parseImportRaw(raw: string): Node[] {
  const importPath = raw.replace(/.* from /gm, "").replace(/["';]/gm, "");

  const nodes: Node[] = [];

  const onlyImport = raw.replace("import ", "").replace(/ from .*/, "");

  if (onlyImport) {
    defaultImport: {
      const defaultImportName = onlyImport.match(/^[a-zA-Z0-9* ]+/gm)?.at(0);
      if (!defaultImportName) {
        break defaultImport;
      }
      const [importName, importNameAs] = defaultImportName.split(" as ");
      nodes.push({
        type: "default",
        importName,
        importNameAs,
        importPath,
        raw,
      });
    }
    namedImport: {
      const namedExportNames = onlyImport.match(/{.*}/)?.at(0)?.replace(
        /[ {}]/gm,
        "",
      );
      if (!namedExportNames) {
        break namedImport;
      }
      for (const namedExportName of namedExportNames?.split(",")) {
        const [importName, importNameAs] = namedExportName.split(" as ");
        nodes.push({
          type: "named",
          importName,
          importNameAs,
          importPath,
          raw,
        });
      }
    }
  }
  return nodes;
}
