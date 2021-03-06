/**
 * kebab-case => PascalCase
 */
export function kebabToPascal(text: string): string {
  return text
    .split("-")
    .map((text) => text[0].toUpperCase() + text.substr(1))
    .join("");
}

/**
 * PascalCase => camelCase
 */
export function pascalToCamel(text: string) {
  return text[0].toLowerCase() + text.substr(1);
}
