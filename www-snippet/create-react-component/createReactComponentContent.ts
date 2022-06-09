import { CreateReactComponentOption } from "./CreateReactComponentOption.ts";

export const createReactComponentContent = (
  name: string,
  option: CreateReactComponentOption,
) => {
  if (!option.forwardRef) {
    return `import React, { memo, PropsWithChildren } from "react";

export interface ${name}Props {}

${
      option.onlyNamedExport
        ? "export const"
        : "const"
    } ${name} = memo((({}: PropsWithChildren<${name}Props>) => {
  return <>${name}</>;
}));

${option.onlyNamedExport === false ? `export default ${name};` : ""}
`;
  }

  return `import React, { forwardRef, memo, HTMLAttributes } from "react";

type RefElement = HTMLDivElement;
type RefElementProps = HTMLAttributes<HTMLDivElement>;

export interface ${name}Props extends RefElementProps {}

${
    option.onlyNamedExport
      ? "export const"
      : "const"
  } ${name} = memo(forwardRef<RefElement, ${name}Props>((props, ref) => {
  return <div ref={ref} {...props}>Lorem Ipsum</div>;
}));

${option.onlyNamedExport === false ? `export default ${name};` : ""}

${name}.displayName = "${name}";
`;
};
