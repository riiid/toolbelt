import { GenOptions } from "./index.ts";
import * as path from "https://deno.land/std@0.126.0/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export default async function gen(
  { pollapoDir, outDir }: GenOptions,
): Promise<void> {
  console.log("Running pbjs...");
  await Deno.run({
    cmd: ["bash", path.resolve(__dirname, "../pbjs/pbjs.sh")],
    env: {
      PROTO_PATH: pollapoDir,
      OUT_DIR: outDir,
    },
  }).status();
}
