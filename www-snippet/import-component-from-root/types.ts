export type Node = {
  type: "named" | "default";
  importName: string;
  importNameAs?: string;
  importPath: string;
  raw: string;
};
