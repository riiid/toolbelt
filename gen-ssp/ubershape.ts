import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import { Schema } from "https://deno.land/x/ubershape@v0.0.12/schema.ts";
import { schema2ts } from "https://deno.land/x/ubershape@v0.0.12/codegen/ts.ts";
import { getReadFunction } from "https://deno.land/x/ubershape@v0.0.12/io/read-schema.ts";

export interface CompileResult {
  schema: Schema;
  code: string;
}
export function compile(
  ubershapePath: string,
  subshapePaths: string[],
): CompileResult[] {
  const read = getReadFunction();
  const ubershape = read(path.resolve(ubershapePath));
  const subshapes = subshapePaths.map(
    (subshapePath) => path.resolve(subshapePath),
  ).map(read);
  const readResults = [ubershape, ...subshapes];
  return readResults.map(({ schema }) => ({
    schema,
    code: schema2ts(schema),
  }));
}
