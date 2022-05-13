export const createImportRaw = (
  defaultImport?: string,
  namedImports?: string[],
  from?: string,
) => {
  const arr: string[] = ["import"];
  if (defaultImport) {
    arr.push(`${defaultImport}${namedImports ? "," : ""}`);
  }
  if (namedImports) {
    arr.push(`{ ${namedImports.join(", ")} }`);
  }
  if (from) {
    arr.push("from", `"${from}";`);
  }
  return arr.join(" ");
};
