import firebaseData from "./legacy-firebase-data.ts";
import { Patent } from "../schema/index.ts";

if (import.meta.main) {
  for (const item of iterPatents()) {
    console.log(item);
  }
}

export function* iterPatents(): Generator<Patent> {
  const patents = firebaseData.achievement.filter(
    (item) => item.type === "patent",
  );
  for (const item of patents) {
    yield {
      "name-ko": item.subject.ko,
      "name-en": item.subject.en,
      link: item.href,
      date: item.date,
    };
  }
}
