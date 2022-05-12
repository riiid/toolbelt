import { GenOptions } from "./index.ts";
import { ensureDir } from "https://deno.land/std@0.138.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.138.0/path/mod.ts";
import { globFiles } from "../misc/fs.ts";
import { generateKeycloakUtil, getClientRoles } from "../keycloak.ts";

export default async function gen(
  { pollapoDir, outDir }: GenOptions,
): Promise<void> {
  const clientRolesPaths = await globFiles(
    pollapoDir,
    "**/keycloak/client-roles.yaml",
  );
  if (clientRolesPaths.length < 1) return;
  console.log("Generating keycloak utils...");
  const outPath = path.resolve(outDir, "backoffice-auth");
  await ensureDir(outPath);
  const clientRoles = await getClientRoles(clientRolesPaths);
  await Deno.writeTextFile(
    path.resolve(outPath, "index.ts"),
    await generateKeycloakUtil(clientRoles),
  );
}
