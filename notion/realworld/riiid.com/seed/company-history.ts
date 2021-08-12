import firebaseData from "./legacy-firebase-data.ts";
import { CompanyHistoryItem } from "../index.ts";

if (import.meta.main) {
  for (const item of iterCompanyHistory()) {
    console.log(item);
  }
}

export function* iterCompanyHistory(): Generator<CompanyHistoryItem> {
  for (const item of _iter()) {
    yield {
      lang: item.lang,
      contents: item.contents as unknown as string[],
      year: item.year,
    };
  }
}

function* _iter() {
  const { en, ko } = firebaseData.companyHistory;
  for (const item of en) yield { ...item, lang: "en" as const };
  for (const item of ko) yield { ...item, lang: "ko" as const };
}
