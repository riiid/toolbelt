import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import { parseImportRaw } from "./parseImportRaw.ts";

Deno.test("parseImportRaw - default export", () => {
  const nodes = parseImportRaw(
    `import ThisDefaultImport from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";`,
  );
  assertEquals(nodes.at(0)?.importName, "ThisDefaultImport");
});
Deno.test("parseImportRaw - default export as", () => {
  const nodes = parseImportRaw(
    `import * as ThisDefaultImportAs from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";`,
  );
  assertEquals(nodes.at(0)?.importName, "*");
  assertEquals(nodes.at(0)?.importNameAs, "ThisDefaultImportAs");
});
Deno.test("parseImportRaw - named export", () => {
  const nodes = parseImportRaw(
    `import {Command} as ThisDefaultImportAs from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";`,
  );
  assertEquals(nodes.at(0)?.type, "named");
  assertEquals(nodes.at(0)?.importName, "Command");
});
