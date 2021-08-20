import { bold } from "https://deno.land/std@0.105.0/fmt/colors.ts";
import {
  print,
  println,
} from "https://deno.land/x/pbkit@v0.0.14/cli/pollapo/misc/stdio.ts";
import { open as openBrowser } from "https://deno.land/x/pbkit@v0.0.14/cli/pollapo/misc/browser.ts";

export default async function (title: string, url: string) {
  await print(
    `- ${bold("Press Enter")} to open ${title} in your browser... `,
  );
  await Deno.stdin.read(new Uint8Array(1));
  const { success } = await openBrowser(url);
  if (!success) {
    await println(
      "Failed opening a browser. Please try entering the URL in your browser manually.",
    );
    await println(url);
  }
}
