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
