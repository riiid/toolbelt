import { createReactComponentReExportContent } from "./createReactComponentReExportContent.ts";
import { assertSnapshot } from "https://deno.land/std@0.138.0/testing/snapshot.ts";

Deno.test(
  `should return correct react component re-export.`,
  async (t) => {
    await assertSnapshot(
      t,
      createReactComponentReExportContent("LoremIpsum", {}),
    );
    await assertSnapshot(
      t,
      createReactComponentReExportContent("LoremIpsum", {
        onlyNamedExport: true,
      }),
    );
  },
);
