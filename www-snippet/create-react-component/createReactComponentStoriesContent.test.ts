import { createReactComponentStoriesContent } from "./createReactComponentStoriesContent.ts";
import { assertSnapshot } from "https://deno.land/std@0.138.0/testing/snapshot.ts";

Deno.test(
  `should return correct react component stories.`,
  async (t) => {
    await assertSnapshot(
      t,
      createReactComponentStoriesContent("LoremIpsum", {}),
    );
    await assertSnapshot(
      t,
      createReactComponentStoriesContent("LoremIpsum", {
        onlyNamedExport: true,
      }),
    );
  },
);
