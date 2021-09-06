import {
  createReactComponentContent,
  createReactComponentReExportContent,
  createReactComponentStoriesContent,
  createReactComponentTestingContent,
} from "./create-react-component-template.ts";
import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { readMockFile } from "./__mocks__/readMockFile.ts";

Deno.test(
  `should return correct react component.`,
  async () => {
    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: false,
      }),
      await readMockFile("react-component/LoremIpsum_tsx"),
    );

    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: true,
      }),
      await readMockFile("react-component/LoremIpsumWithRef_tsx"),
    );
  },
);

Deno.test(
  `should return correct react component testing.`,
  async () => {
    assertEquals(
      createReactComponentTestingContent("LoremIpsum", {}),
      await readMockFile("react-component/LoremIpsum_spec_tsx"),
    );
  },
);

Deno.test(
  `should return correct react component stories.`,
  async () => {
    assertEquals(
      createReactComponentStoriesContent("LoremIpsum", {}),
      await readMockFile("react-component/LoremIpsum_stories_tsx"),
    );
  },
);

Deno.test(
  `should return correct react component re-export.`,
  async () => {
    assertEquals(
      createReactComponentReExportContent("", {}),
      await readMockFile("react-component/index_ts"),
    );
  },
);
