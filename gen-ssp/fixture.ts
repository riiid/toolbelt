import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.95.0/path/mod.ts";

const fixtureFiles = [
  "app-bridge/android.ts",
  "app-bridge/iframe.ts",
  "app-bridge/index.ts",
  "app-bridge/ios.ts",
];

export async function copyFixtures(outPath: string): Promise<void> {
  for (const fixtureFile of fixtureFiles) {
    const dstPath = path.resolve(outPath, fixtureFile);
    const srcPath = getFixturePath(fixtureFile);
    const fixture = await Deno.readTextFile(srcPath);
    await ensureDir(path.dirname(dstPath));
    await Deno.writeTextFile(dstPath, fixture);
  }
}

function getFixturePath(subpath: string): string {
  const url = new URL(import.meta.url);
  return path.resolve(path.dirname(url.pathname), "fixture", subpath);
}
