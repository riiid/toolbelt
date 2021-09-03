import { createReactComponentContent } from "./react-component.ts";
import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";

Deno.test(
  `createReactComponentContent("LoremIpsum", {
  forwardRef: false,
}`,
  () => {
    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: false,
      }),
      `import React, { PropsWithChildren, memo } from "react";
export interface LoremIpsumProps {}

const LoremIpsum = (({}: PropsWithChildren<LoremIpsumProps>) => {
  return <>LoremIpsum</>;
});

export default memo(LoremIpsum);`,
    );
  },
);

Deno.test(
  `createReactComponentContent("LoremIpsum", {
  forwardRef: true,
})`,
  () => {
    assertEquals(
      createReactComponentContent("LoremIpsum", {
        forwardRef: true,
      }),
      `import React, { forwardRef, memo } from "react";
type TypeRef = any;

export interface LoremIpsumProps {}

const LoremIpsum = forwardRef<TypeRef, LoremIpsumProps>(({}, ref) => {
  return <>LoremIpsum</>;
});

export default memo(LoremIpsum);

LoremIpsum.displayName = "LoremIpsum";`,
    );
  },
);
