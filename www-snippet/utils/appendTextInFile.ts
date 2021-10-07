export async function appendTextInFile(path: string, toAppend: string) {
  const text = await Deno.readTextFile(path);
  await Deno.writeTextFile(
    path,
    `${toAppend}
${text}`,
  );
}
