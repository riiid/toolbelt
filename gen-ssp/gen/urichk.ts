import { GenOptions } from "./index.ts";
import { ensureDir } from "https://deno.land/std@0.138.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.138.0/path/mod.ts";
import { compile as compileNextjsNavigationHook } from "https://deno.land/x/urichk@v0.0.11/compile/nextjs-navigation-hook.ts";
import { compile as compileNextjsSearchParamsHook } from "https://deno.land/x/urichk@v0.0.11/compile/nextjs-search-params-hook.ts";
import { kebabToPascal } from "../misc/case.ts";
import { iterWebUrichkFiles } from "../urichk.ts";

export default async function gen(
  { pollapoDir, outDir }: GenOptions,
): Promise<void> {
  console.log("Generating urichk utils...");
  const outPath = path.resolve(outDir, "next");
  await ensureDir(outPath);
  for await (const { schema, name } of iterWebUrichkFiles(pollapoDir)) {
    await Deno.writeTextFile(
      path.resolve(outPath, `useNavigate${kebabToPascal(name)}.ts`),
      compileNextjsNavigationHook(schema, { name }),
    );
    await Deno.writeTextFile(
      path.resolve(outPath, `use${kebabToPascal(name)}SearchParams.ts`),
      compileNextjsSearchParamsHook(schema, { name }),
    );
  }
}
