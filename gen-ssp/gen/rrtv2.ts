import { ensureDir } from "https://deno.land/std@0.126.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import { globFiles } from "../misc/fs.ts";
import { compile as compileUbershape } from "../ubershape.ts";
import { pollapoPath, sspOutPath } from "./index.ts";

export default async function gen(): Promise<void> {
  console.log("Generating rrtv2 utils...");
  const outPath = path.resolve(sspOutPath, "ubershape");
  await ensureDir(outPath);
  const rrtv2Path = path.resolve(
    pollapoPath,
    "riiid/interface-content-model/rrt/v2",
  );
  const compileResults = compileUbershape(
    path.resolve(rrtv2Path, "riiid-rich-text-v2.ubershape"),
    await globFiles(rrtv2Path, "**/*.subshape"),
  );
  for (const { schema: { name }, code } of compileResults) {
    await Deno.writeTextFile(path.resolve(outPath, name + ".ts"), code);
  }
}
