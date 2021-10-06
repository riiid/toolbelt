export function* getImportRaw(fileContent: string) {
  const importRegex = /import ((.|\n)*?) from ("|').*("|');/gm;

  const parsed = fileContent.match(importRegex);

  for (const item of parsed ?? []) {
    yield item;
  }
}
