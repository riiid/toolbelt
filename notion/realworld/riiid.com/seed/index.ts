import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";
import { createPage, getHeaders, Parent } from "../../../api.ts";
import { PropertySchema, toProperties } from "../../../property.ts";
import { iterCompanyHistory } from "./company-history.ts";

if (import.meta.main) {
  interface Options {
    accessToken: string;
  }
  const command = new Command();
  command
    .name("seed")
    .option("-t, --access-token <token:string>", "notion access token", {
      required: true,
    })
    .action(async (options: Options) => {
      if (!options.accessToken) throw new Error("access token is required");
      const headers = getHeaders(options.accessToken);
      // TODO: parent page id를 입력받아서 database들을 생성후, 생성된 id를 바탕으로 내용을 채우도록 수정하기.
      await initCompanyHistory(headers, "66f41779d39443f2bb2373f3b85ec676");
      // TODO: initPatents
      // TODO: initNews
      // TODO: initFeaturedNews
    })
    .parse(Deno.args);
}

async function initCompanyHistory(headers: Headers, databaseId: string) {
  console.log("initializing company history...");
  const companyHistoryDatabase: Parent = {
    type: "database_id",
    database_id: databaseId,
  };
  const companyHistorySchema = getCompanyHistorySchema();
  for (const companyHistoryItem of iterCompanyHistory()) {
    console.log(companyHistoryItem);
    const properties = toProperties(
      companyHistorySchema,
      companyHistoryItem,
    );
    const children = companyHistoryItem.contents.map((content) => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        text: [{ type: "text", text: { content } }],
      },
    }));
    await createPage(
      headers,
      companyHistoryDatabase,
      properties,
      children,
    );
  }
}

function getCompanyHistorySchema(): PropertySchema {
  return {
    lang: {
      type: "select",
      select: {
        options: [{ name: "en" }, { name: "ko" }],
      },
    },
    year: {
      type: "title",
      title: {},
    },
  };
}
