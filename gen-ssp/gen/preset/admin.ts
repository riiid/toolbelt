import { runPreset } from "../index.ts";

await runPreset([
  "keycloak",
  "urichk",
  "fixture",
  "pbjs",
  "pb-service",
]);
