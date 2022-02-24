import { globFiles } from "../utils/globFiles.ts";
import { replaceTextInFile } from "../utils/replaceTextInFile.ts";
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";

/**
 * you can test this script in project root folder.
 * `deno run -A --unstable ./www-snippet/rename-components/entrypoint.ts ../jarvis-portal/apps/portal/src/components`
 */

if (import.meta.main) {
  const command = new Command();
  command
    .name("rename-components")
    .description(`
migrate react component naming convention to angular convention.
Card/index.tsx => Card/Card.tsx + Card/index.ts
Card/index.test.tsx, Card/test.tsx => Card/Card.test.tsx
`)
    .arguments("<src:string>")
    .action(
      async (options: unknown, src: string) => {
        for (const file of await globFiles(`${src}/**/index.tsx`)) {
          const segments = file.split("/");
          const folderPath = file.replace("/index.tsx", "");
          const componentName = segments[segments.length - 2];
          for (const subFile of await globFiles(`${folderPath}/*`)) {
            await replaceTextInFile(
              subFile,
              /from ("|').(\/index)?("|');/gm,
              `from './${componentName}';`,
            );
            await replaceTextInFile(
              subFile,
              /from ("|').\/(index.)?styles("|');/gm,
              `from './${componentName}.styles';`,
            );
            const indexRegex = /index.tsx/gm;
            if (indexRegex.test(subFile)) {
              Deno.rename(
                subFile,
                subFile.replace(indexRegex, `${componentName}.tsx`),
              );
            }
            const stylesRegex = /(index.)?styles.ts(x)?/gm;
            if (stylesRegex.test(subFile)) {
              Deno.rename(
                subFile,
                subFile.replace(stylesRegex, `${componentName}.styles.tsx`),
              );
            }
            const storiesRegex = /(index.)?stories.ts(x)?/gm;
            if (storiesRegex.test(subFile)) {
              Deno.rename(
                subFile,
                subFile.replace(storiesRegex, `${componentName}.stories.tsx`),
              );
            }
            const testRegex = /(index.)?test.ts(x)?/gm;
            if (testRegex.test(subFile)) {
              Deno.rename(
                subFile,
                subFile.replace(testRegex, `${componentName}.test.tsx`),
              );
            }
          }
          const encoder = new TextEncoder();
          const data = encoder.encode(
            `export * from './${componentName}';\nexport {default as ${componentName}} from './${componentName}';`,
          );

          Deno.writeFile(`${folderPath}/index.ts`, data);
        }
      },
    )
    .parse(Deno.args);
}
