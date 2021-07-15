import { emptyDir } from "https://deno.land/std@0.95.0/fs/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v0.18.2/mod.ts";

export const pollapoPath = ".pollapo";
export const sspOutPath = "src/generated/ssp";

export type Generator = (typeof generators)[number];
export const generators = [
  "fixture",
  "keycloak",
  "pbjs",
  "pb-service",
  "rrtv2",
  "urichk",
] as const;
export async function runPreset(
  preset: Generator[],
  clean = true,
): Promise<void> {
  if (clean) await emptyDir(sspOutPath);
  for (const generator of preset) {
    await (await import(`./${generator}.ts`)).default();
  }
}

if (import.meta.main) {
  const cleanCommand = (new Command())
    .description("clean out dir")
    .action(() => emptyDir(sspOutPath));
  const runCommand = (new Command())
    .description("generate utils")
    .arguments("<generators...:string>")
    .action(async (_, generators: Generator[]) => {
      await runPreset(generators, false);
    });
  const command = new Command();
  command
    .name("gen-ssp")
    .arguments("<command>")
    .action(() => command.showHelp())
    .command("clean", cleanCommand)
    .command("run", runCommand)
    .parse(Deno.args);
}
