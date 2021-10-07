import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { getImportRaw } from "./getImportRaw.ts";

const typescriptContent =
  `import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";

import {
  createReactComponentContent,
  createReactComponentReExportContent,
  createReactComponentStoriesContent,
  createReactComponentTestingContent,
  ReactComponentOption,
} from "./create-react-component-template.ts";

import { createFile } from "./utils/createFile.ts";
`;

Deno.test(`getImportRaw`, () => {
  const code = getImportRaw(typescriptContent);

  assertEquals(
    code.next().value,
    `import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";`,
  );

  assertEquals(
    code.next().value,
    `import {
  createReactComponentContent,
  createReactComponentReExportContent,
  createReactComponentStoriesContent,
  createReactComponentTestingContent,
  ReactComponentOption,
} from "./create-react-component-template.ts";`,
  );

  assertEquals(
    code.next().value,
    `import { createFile } from "./utils/createFile.ts";`,
  );
});
