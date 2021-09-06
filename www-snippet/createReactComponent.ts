import { stringify } from "https://deno.land/std@0.98.0/encoding/yaml.ts";
import { walk } from "https://deno.land/std@0.98.0/fs/walk.ts";
import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";
import { ReactComponentOption } from "./react-component.ts";

export interface Table {
  [key: string]: string[];
}

if (import.meta.main) {
  const command = new Command();
  command
    .name("riiid-create-react-component")
    .arguments("<dir:string> <name:string>")
    .option("-F, --forwardRef", "generate forwardRef component")
    .action(
      async (options: ReactComponentOption, dir: string, name: string) => {
        console.log(options, dir, name);
      },
    )
    .parse(Deno.args);
}
