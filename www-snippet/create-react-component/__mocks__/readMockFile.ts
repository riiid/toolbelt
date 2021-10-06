import { resolve } from "https://deno.land/std@0.106.0/path/mod.ts";

export const mockFilePaths = [
  "react-component/LoremIpsum_tsx",
  "react-component/LoremIpsumWithRef_tsx",
  "react-component/LoremIpsum_stories_tsx",
  "react-component/LoremIpsum_spec_tsx",
  "react-component/index_ts",
] as const;

export type MockFilePath = typeof mockFilePaths[number];

export const readMockFile = async (
  subPath: MockFilePath,
) => {
  const url = new URL(import.meta.url);
  const pathname = decodeURI(url.pathname);

  return await Deno.readTextFile(
    resolve(
      pathname,
      `../${subPath}`,
    ),
  );
};
