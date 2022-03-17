import { GenOptions } from "./index.ts";
import { copyFixtures } from "../fixture.ts";

export default async function gen({ outDir }: GenOptions): Promise<void> {
  console.log("Copying fixtures...");
  await copyFixtures(outDir);
}
