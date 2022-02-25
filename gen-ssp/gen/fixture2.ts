import { copyFixtures } from "../fixture2.ts";
import { sspOutPath } from "./index.ts";

export default async function gen(): Promise<void> {
  console.log("Copying app-bridge, client, server fixtures...");
  await copyFixtures(sspOutPath);
}
