import { ensureDir } from "https://deno.land/std@0.126.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.126.0/path/mod.ts";

export interface TextFile {
  dir: string[];
  fileName: string;
  code: string;
}
export type TextFiles = TextFile[];
export async function writeTextFiles(
  textFiles: TextFiles,
  outDir: string,
): Promise<void> {
  for (const { dir, fileName, code } of textFiles) {
    await ensureDir(path.resolve(outDir, ...dir));
    await Deno.writeTextFile(path.resolve(outDir, ...dir, fileName), code);
  }
}
