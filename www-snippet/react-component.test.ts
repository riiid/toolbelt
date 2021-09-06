import { createReactComponentContent } from "./react-component.ts";
import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import * as log from "https://deno.land/std@0.106.0/log/mod.ts";
import * as path from "https://deno.land/std@0.106.0/path/mod.ts";

const readMockFile = async (
  subPath: "react-component/LoremIpsum" | "react-component/LoremIpsumWithRef",
) => {
  const url = new URL(import.meta.url);
  const pathname = decodeURI(url.pathname);

  return await Deno.readTextFile(
    path.resolve(
      pathname,
      `../__mocks__/${subPath}`,
    ),
  );
};

Deno.test(
  `should return correct react component.`,
  async () => {
    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: false,
      }),
      await readMockFile("react-component/LoremIpsum"),
    );

    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: true,
      }),
      await readMockFile("react-component/LoremIpsumWithRef"),
    );
  },
);
