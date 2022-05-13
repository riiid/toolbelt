import {
  assertSnapshot,
} from "https://deno.land/std@0.138.0/testing/snapshot.ts";
import { createReactComponentContent } from "./createReactComponentContent.ts";

Deno.test(
  `should return correct react component.`,
  async (t) => {
    await assertSnapshot(
      t,
      createReactComponentContent("LoremIpsum", {
        forwardRef: false,
        onlyNamedExport: false,
      }),
    );

    await assertSnapshot(
      t,
      createReactComponentContent("LoremIpsum", {
        forwardRef: true,
        onlyNamedExport: false,
      }),
    );
    await assertSnapshot(
      t,
      createReactComponentContent("LoremIpsum", {
        forwardRef: false,
        onlyNamedExport: true,
      }),
    );

    await assertSnapshot(
      t,
      createReactComponentContent("LoremIpsum", {
        forwardRef: true,
        onlyNamedExport: true,
      }),
    );
  },
);
