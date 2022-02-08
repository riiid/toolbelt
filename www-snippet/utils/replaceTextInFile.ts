export async function replaceTextInFile(
  path: string,
  origin: RegExp | string,
  target: string,
) {
  const text = await Deno.readTextFile(path);
  await Deno.writeTextFile(
    path,
    text.replace(origin, target),
  );
}
