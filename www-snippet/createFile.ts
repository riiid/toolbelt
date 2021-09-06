import * as path from "https://deno.land/std@0.106.0/path/mod.ts";

const createFile = async (
  subPath: string,
  fileName: string,
  fileContent: string,
) => {
  const targetPath = path.join(Deno.cwd(), subPath);
  const file = await Deno.create(`${targetPath}/${fileName}`);
  const encoder = new TextEncoder();
  const content = encoder.encode(fileContent);

  await file.write(content);
};
Deno.cwd();
