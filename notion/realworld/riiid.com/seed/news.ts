import firebaseData from "./legacy-firebase-data.ts";
import { News } from "../schema/index.ts";

if (import.meta.main) {
  for (const item of iterNews()) {
    console.log(item);
  }
}

export function* iterNews(): Generator<News> {
  const news = firebaseData.news.filter(
    (item) => item.type === "press",
  );
  for (const item of news) {
    yield {
      name: item.subject.en,
      link: item.href,
      date: item.date,
    };
  }
}
