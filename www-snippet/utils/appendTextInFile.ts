import { readFile } from "./readFile.ts";
import { writeFile } from "./writeFile.ts";

export async function appendTextInFile(path: string, toAppend: string) {
  const text = await readFile(path);
  await writeFile(
    path,
    `${toAppend}
${text}`,
  );
}
