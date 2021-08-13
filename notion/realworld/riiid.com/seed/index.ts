import { Command } from "https://deno.land/x/cliffy@v0.19.1/command/mod.ts";
import { createPage, getHeaders, Parent } from "../../../api.ts";
import { PropertySchema, toProperties } from "../../../property.ts";
import { iterCompanyHistory } from "./company-history.ts";
import { iterPatents } from "./patents.ts";
import { iterNews } from "./news.ts";
import { iterFeaturedNews } from "./featured-news.ts";

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
      try {
        // TODO: parent page id를 입력받아서 database들을 생성후, 생성된 id를 바탕으로 내용을 채우도록 수정하기.
        await initCompanyHistory(headers, "66f41779d39443f2bb2373f3b85ec676");
        await initPatents(headers, "d0cea61b1a1449099a90ff7e89824eca");
        await initNews(headers, "e77099d698d340c8a53406383a0eb6e2");
        await initFeaturedNews(headers, "2997f4abc22449ba9c546ce523fa0a33");
      } catch (err) {
        console.error(err);
      }
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

async function initPatents(headers: Headers, databaseId: string) {
  console.log("initializing patents...");
  const patentsDatabase: Parent = {
    type: "database_id",
    database_id: databaseId,
  };
  const patentsSchema = getPatentSchema();
  for (const patentItem of iterPatents()) {
    console.log(patentItem);
    const properties = toProperties(
      patentsSchema,
      patentItem,
    );
    await createPage(
      headers,
      patentsDatabase,
      properties,
      [],
    );
  }
}

async function initNews(headers: Headers, databaseId: string) {
  console.log("initializing news...");
  const newsDatabase: Parent = {
    type: "database_id",
    database_id: databaseId,
  };
  const newsSchema = getNewsSchema();
  for (const newsItem of iterNews()) {
    console.log(newsItem);
    const properties = toProperties(
      newsSchema,
      newsItem,
    );
    await createPage(
      headers,
      newsDatabase,
      properties,
      [],
    );
  }
}

async function initFeaturedNews(headers: Headers, databaseId: string) {
  console.log("initializing featured news...");
  const featuredNewsDatabase: Parent = {
    type: "database_id",
    database_id: databaseId,
  };
  const featuredNewsSchema = getFeaturedNewsSchema();
  for (const featuredNewsItem of iterFeaturedNews()) {
    console.log(featuredNewsItem);
    const properties = toProperties(
      featuredNewsSchema,
      featuredNewsItem,
    );
    await createPage(
      headers,
      featuredNewsDatabase,
      properties,
      [],
    );
  }
}

function getCompanyHistorySchema(): PropertySchema {
  return {
    year: {
      type: "title",
      title: {},
    },
    lang: {
      type: "select",
      select: {
        options: [{ name: "en" }, { name: "ko" }],
      },
    },
  };
}

function getPatentSchema(): PropertySchema {
  return {
    "name-ko": {
      type: "title",
      title: {},
    },
    "name-en": {
      type: "rich_text",
      rich_text: {},
    },
    link: {
      type: "url",
      url: {},
    },
    date: {
      type: "date",
      date: {},
    },
  };
}

function getNewsSchema(): PropertySchema {
  return {
    name: {
      type: "title",
      title: {},
    },
    link: {
      type: "url",
      url: {},
    },
    date: {
      type: "date",
      date: {},
    },
  };
}

function getFeaturedNewsSchema(): PropertySchema {
  return {
    name: {
      type: "title",
      title: {},
    },
    link: {
      type: "url",
      url: {},
    },
    date: {
      type: "date",
      date: {},
    },
    preview: {
      type: "url",
      url: {},
    },
    preview2x: {
      type: "url",
      url: {},
    },
    thumbnail: {
      type: "url",
      url: {},
    },
    thumbnail2x: {
      type: "url",
      url: {},
    },
  };
}
