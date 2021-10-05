export function writeFile(path: string, data: string): Promise<void> {
  return Deno.writeTextFile(path, data);
}
