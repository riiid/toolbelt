export async function removeTextInFile(path: string, toRemove: string) {
  const text = await Deno.readTextFile(path);
  await Deno.writeTextFile(path, text.replaceAll(toRemove, ""));
}
