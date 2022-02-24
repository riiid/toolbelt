import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import {
  createReactComponentContent,
  createReactComponentReExportContent,
  createReactComponentStoriesContent,
  createReactComponentTestingContent,
  ReactComponentOption,
} from "./create-react-component-template.ts";
import { createFile } from "../utils/createFile.ts";

if (import.meta.main) {
  const command = new Command();
  command
    .name("create-react-component")
    .description(`
react component snippet.
includes component, test, storybook, re-export.

example.

- create-react-component src/components HelloWorld
    `)
    .arguments("<dir:string> <name:string>")
    .option("-F, --forwardRef", "generate forwardRef component")
    .action(
      async (options: ReactComponentOption, dir: string, name: string) => {
        if (!dir || !name) throw Error("invalid arguments");
        await createFile(
          `${dir}/${name}`,
          `${name}.tsx`,
          createReactComponentContent(name, options),
        );
        await createFile(
          `${dir}/${name}`,
          `${name}.stories.tsx`,
          createReactComponentStoriesContent(name, options),
        );
        await createFile(
          `${dir}/${name}`,
          `${name}.spec.tsx`,
          createReactComponentTestingContent(name, options),
        );
        await createFile(
          `${dir}/${name}`,
          `index.ts`,
          createReactComponentReExportContent(name, options),
        );
      },
    )
    .parse(Deno.args);
}
