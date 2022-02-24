import { ensureDir } from "https://deno.land/std@0.126.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import { compile as compileNextjsNavigationHook } from "https://deno.land/x/urichk@v0.0.3/compile/nextjs-navigation-hook.ts";
import { compile as compileNextjsSearchParamsHook } from "https://deno.land/x/urichk@v0.0.3/compile/nextjs-search-params-hook.ts";
import { kebabToPascal } from "../misc/case.ts";
import { iterWebUrichkFiles } from "../urichk.ts";
import { pollapoPath, sspOutPath } from "./index.ts";

export default async function gen(): Promise<void> {
  console.log("Generating urichk utils...");
  const outPath = path.resolve(sspOutPath, "next");
  await ensureDir(outPath);
  for await (const { schema, name } of iterWebUrichkFiles(pollapoPath)) {
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
