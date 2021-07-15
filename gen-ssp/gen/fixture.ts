import { copyFixtures } from "../fixture.ts";
import { sspOutPath } from "./index.ts";

export default async function gen(): Promise<void> {
  console.log("Copying fixtures...");
  await copyFixtures(sspOutPath);
}
