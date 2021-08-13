import { PropertySchema } from "../../../property.ts";

export interface CompanyHistoryItem {
  lang: "en" | "ko";
  contents: string[];
  year: number;
}

export interface Patent {
  "name-ko": string;
  "name-en": string;
  link: string;
  date: string;
}

export interface News {
  name: string;
  link: string;
  date: string;
}

export interface FeaturedNews {
  name: string;
  link: string;
  date: string;
  preview: string;
  preview2x: string;
  thumbnail: string;
  thumbnail2x: string;
}

export function getCompanyHistorySchema(): PropertySchema {
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

export function getPatentSchema(): PropertySchema {
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

export function getNewsSchema(): PropertySchema {
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

export function getFeaturedNewsSchema(): PropertySchema {
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
