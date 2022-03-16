import { emptyDir } from "https://deno.land/std@0.126.0/fs/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.126.0/path/mod.ts";
import { Command, EnumType } from "https://deno.land/x/cliffy@v0.20.1/mod.ts";

const defaultPollapoDir = ".pollapo";
const defaultOutDir = "src/generated/ssp";

export interface GenOptions {
  pollapoDir: string;
  outDir: string;
}

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

export interface RunPresetOptions extends GenOptions {
  preset: Generator[];
  clean?: boolean;
}
export async function runPreset({
  preset,
  outDir,
  clean = true,
}: RunPresetOptions): Promise<void> {
  if (clean) await emptyDir(outDir);
  for (const generator of preset) {
    await (await import(`./${generator}.ts`)).default();
  }
}

if (import.meta.main) {
  const cleanCommand = (new Command<void>())
    .description("clean out dir")
    .option<{ path: string }>(
      "-p, --path [path: string]",
      "path for codegen output",
      { default: defaultOutDir },
    )
    .action(({ path }) => emptyDir(path));
  const runCommand = (new Command())
    .type("generator", generatorEnum)
    .description("generate utils")
    .option(
      "-P, --pollapo-dir [pollapoDir:string]",
      "path of pollapo directory",
      { default: defaultPollapoDir },
    )
    .option(
      "-o, --out-dir [outDir: string]",
      "path for codegen output",
      { default: defaultOutDir },
    )
    .arguments<[Generator[]]>("<generators...:generator>")
    .action(async (option: GenOptions, generators) => {
      await runPreset({
        preset: generators,
        clean: false,
        ...option,
      });
    });
  const runPresetCommand = (new Command())
    .type("preset", presetEnum)
    .description("generate utils with preset generators")
    .option(
      "-P, --pollapo-dir [pollapoDir:string]",
      "path of pollapo directory",
      { default: defaultPollapoDir },
    )
    .option(
      "-o, --out-dir [outDir: string]",
      "path for codegen output",
      { default: defaultOutDir },
    )
    .arguments<[Preset]>("<preset:preset>")
    .action(async (option: GenOptions, preset) => {
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
