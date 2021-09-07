import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.95.0/path/mod.ts";

const createDirectoryIfNotExist = async (path: string) => {
  const pathUrl = (path);
  try {
    await ensureDir(pathUrl);
  } catch {
    await Deno.mkdir(pathUrl, {
      recursive: true,
    });
  }
};

export const createFile = async (
  subPath: string,
  fileName: string,
  fileContent: string,
) => {
  const targetPath = resolve(Deno.cwd(), subPath);

  await createDirectoryIfNotExist(targetPath);

  const file = await Deno.create(`${targetPath}/${fileName}`);

  const encoder = new TextEncoder();
  const content = encoder.encode(fileContent);

  await file.write(content);
};
