export function readFile(path: string): Promise<string> {
  return Deno.readTextFile(path);
}
