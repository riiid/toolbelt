import firebaseData from "./legacy-firebase-data.ts";
import { FeaturedNews } from "../index.ts";

if (import.meta.main) {
  for (const item of iterFeaturedNews()) {
    console.log(item);
  }
}

export function* iterFeaturedNews(): Generator<FeaturedNews> {
  const news = firebaseData.recentNews;
  for (const item of news) {
    yield {
      name: item.subject.en,
      link: item.href,
      date: item.date,
      preview: item.preview,
      preview2x: item.preview2x,
      thumbnail: item.thumbnail,
      thumbnail2x: item.thumbnail2x,
    };
  }
}
