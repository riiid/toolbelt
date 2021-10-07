import { globFiles } from "../utils/globFiles.ts";
import { appendTextInFile } from "../utils/appendTextInFile.ts";
import { removeTextInFile } from "../utils/removeTextInFile.ts";
import { getImportRaw } from "./getImportRaw.ts";
import { parseImportRaw } from "./parseImportRaw.ts";
import { Node } from "./types.ts";
import { matchNode } from "./matchNode.ts";
import { serializeImportRaw } from "./serializeImportRaw.ts";
import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";

if (import.meta.main) {
  const command = new Command();
  command
    .name("organize-import-path")
    .description(`
this tool organize import path using given path below src folder.

1. it remove all subpath about given path.
2. it change every imports to named imports from given path

for example.
\`\`\`sh
organize-import-path @riiid/design-system-react
\`\`\`
\`\`\`typescript
import Button, {ButtonProps} from '@riiid/design-system-react/lib/components/Button'; // before
import { Button, ButtonProps } from '@riiid/design-system-react'; // after
\`\`\`
`)
    .arguments("<pkg:string>")
    .action(
      async (options: unknown, pkg: string) => {
        for (const file of await globFiles(`src/**/*`)) {
          const nodes: Node[] = [];
          const content = await Deno.readTextFile(file);
          for (const importRaw of getImportRaw(content)) {
            nodes.push(...parseImportRaw(importRaw));
          }
          for (const node of nodes) {
            if (matchNode(pkg, node)) {
              await removeTextInFile(file, node.raw);
            }
          }
          const newImportRaw = serializeImportRaw(pkg, nodes);
          if (newImportRaw) await appendTextInFile(file, newImportRaw);
        }
      },
    )
    .parse(Deno.args);
}
