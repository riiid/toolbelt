import { assertEquals } from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { createImportRaw } from "./createImportRaw.ts";

Deno.test(
  `should return correct react component testing.`,
  async () => {
    assertEquals(
      createImportRaw("LoremIpsum", undefined, "./LoremIpsum"),
      `import LoremIpsum from "./LoremIpsum";`,
    );
    assertEquals(
      createImportRaw(
        "LoremIpsum",
        ["LoremIpsum2", "LoremIpsum3"],
        "./LoremIpsum",
      ),
      `import LoremIpsum, { LoremIpsum2, LoremIpsum3 } from "./LoremIpsum";`,
    );
    assertEquals(
      createImportRaw(
        undefined,
        ["LoremIpsum2", "LoremIpsum3"],
        "./LoremIpsum",
      ),
      `import { LoremIpsum2, LoremIpsum3 } from "./LoremIpsum";`,
    );
  },
);
