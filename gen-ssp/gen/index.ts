import { emptyDir } from "https://deno.land/std@0.126.0/fs/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.126.0/path/mod.ts";
import { Command, EnumType } from "https://deno.land/x/cliffy@v0.20.1/mod.ts";

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
  "fixture2",
  "pbkit",
] as const;
const generatorEnum = new EnumType(generators);

export type Preset = (typeof presets)[number];
export const presets = [
  "admin",
  "all",
  "library",
  "product",
  "product2",
] as const;
const presetEnum = new EnumType(presets);

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
    .type("generator", generatorEnum)
    .description("generate utils")
    .arguments<[Generator[]]>("<generators...:generator>")
    .action(async (_, generators) => {
      await runPreset(generators, false);
    });
  const runPresetCommand = (new Command())
    .type("preset", presetEnum)
    .description("generate utils with preset generators")
    .arguments<[Preset]>("<preset:preset>")
    .action(async (_, preset) => {
      const __dirname = dirname(fromFileUrl(import.meta.url));
      await import(join(__dirname, "preset", `./${preset}.ts`));
    });
  const command = new Command();
  command
    .name("gen-ssp")
    .arguments("<command>")
    .action(() => command.showHelp())
    .command("clean", cleanCommand)
    .command("run", runCommand)
    .command("run-preset", runPresetCommand)
    .parse(Deno.args);
}
