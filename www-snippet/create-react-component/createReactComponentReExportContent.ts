import { CreateReactComponentOption } from "./CreateReactComponentOption.ts";

export const createReactComponentReExportContent = (
  name: string,
  option: CreateReactComponentOption,
) => {
  return option.onlyNamedExport
    ? `export * from "./${name}";
  `
    : `export { default } from "./${name}";
export * from "./${name}";
`;
};
