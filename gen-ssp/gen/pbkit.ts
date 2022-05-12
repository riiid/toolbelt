import { GenOptions } from "./index.ts";
import * as path from "https://deno.land/std@0.138.0/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export default async function gen(
  { pollapoDir, outDir }: GenOptions,
): Promise<void> {
  console.log("Running pb-gen-ts...");
  await Deno.run({
    cmd: ["bash", path.resolve(__dirname, "../pbkit/pb-gen-ts.sh")],
    env: {
      ENTRY_PATH: pollapoDir,
      OUT_DIR: outDir,
    },
  }).status();
}
