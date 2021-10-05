import { readFile } from "./readFile.ts";
import { writeFile } from "./writeFile.ts";

export async function removeTextInFile(path: string, toRemove: string) {
  const text = await readFile(path);
  await writeFile(path, text.replaceAll(toRemove, ""));
}
