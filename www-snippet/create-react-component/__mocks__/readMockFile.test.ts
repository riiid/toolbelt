import { mockFilePaths, readMockFile } from "./readMockFile.ts";

Deno.test(
  `should exist every mock files`,
  async () => {
    for (const filePath of mockFilePaths) {
      await readMockFile(filePath);
    }
  },
);
