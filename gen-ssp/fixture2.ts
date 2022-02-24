import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.126.0/fs/mod.ts";

export async function copyFixtures(outPath: string): Promise<void> {
  const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const src = path.join(__dirname, "fixture");
  await fs.copy(src, outPath);
}
