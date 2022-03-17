import { GenOptions } from "./index.ts";
import { copyFixtures } from "../fixture2.ts";

export default async function gen({ outDir }: GenOptions): Promise<void> {
  console.log("Copying app-bridge, client, server fixtures...");
  await copyFixtures(outDir);
}
