import * as path from "https://deno.land/std@0.126.0/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export default async function gen(): Promise<void> {
  console.log("Running pb-gen-ts...");
  await Deno.run({
    cmd: ["bash", path.resolve(__dirname, "../pbkit/pb-gen-ts.sh")],
  }).status();
}
