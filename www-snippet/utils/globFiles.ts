import { expandGlob } from "https://deno.land/std@0.95.0/fs/mod.ts";

export async function globFiles(
  pattern: string,
): Promise<string[]> {
  const files: string[] = [];
  for await (
    const entry of expandGlob(pattern, { root: Deno.cwd(), includeDirs: false })
  ) {
    files.push(entry.path);
  }
  return files;
}
