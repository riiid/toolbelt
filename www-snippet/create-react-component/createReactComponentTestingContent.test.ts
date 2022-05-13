import { createReactComponentTestingContent } from "./createReactComponentTestingContent.ts";
import { assertSnapshot } from "https://deno.land/std@0.138.0/testing/snapshot.ts";

Deno.test(
  `should return correct react component testing.`,
  async (t) => {
    await assertSnapshot(
      t,
      createReactComponentTestingContent("LoremIpsum", {}),
    );
    await assertSnapshot(
      t,
      createReactComponentTestingContent("LoremIpsum", {
        onlyNamedExport: true,
      }),
    );
  },
);
