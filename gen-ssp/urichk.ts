import { walk } from "https://deno.land/std@0.138.0/fs/walk.ts";
import * as path from "https://deno.land/std@0.138.0/path/mod.ts";
import { parse } from "https://deno.land/x/urichk@v0.0.11/index.ts";
import type { Urichk } from "https://deno.land/x/urichk@v0.0.11/ast.ts";

export interface UrichkFile {
  name: string;
  text: string;
  schema: Urichk;
}

const ext = ".web.urichk";

export async function* iterWebUrichkFiles(
  dir: string,
): AsyncGenerator<UrichkFile> {
  for await (const entry of walk(dir, { includeDirs: false, exts: [ext] })) {
    const name = path.basename(entry.path, ext);
    const text = await Deno.readTextFile(entry.path);
    const schema = parse(text)!;
    yield { name, text, schema };
  }
}
