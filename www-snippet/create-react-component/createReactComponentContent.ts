import { CreateReactComponentOption } from "./CreateReactComponentOption.ts";

export const createReactComponentContent = (
  name: string,
  option: CreateReactComponentOption,
) => {
  if (!option.forwardRef) {
    return `import React, { memo, PropsWithChildren } from "react";
export interface ${name}Props {}

const ${name} = (({}: PropsWithChildren<${name}Props>) => {
  return <>${name}</>;
});

${
      option.onlyNamedExport
        ? `export { ${name}: memo(${name}) }`
        : `export default memo(${name})`
    };
`;
  }

  return `import React, { forwardRef, memo } from "react";

type RefElement = HTMLDivElement;
type RefElementProps = React.HTMLAttributes<HTMLDivElement>;

export interface ${name}Props extends RefElementProps {}

const ${name} = forwardRef<RefElement, ${name}Props>((props, ref) => {
  return <div ref={ref} {...props}>Lorem Ipsum</div>;
});

${
    option.onlyNamedExport
      ? `export { ${name}: memo(${name}) }`
      : `export default memo(${name})`
  }

${name}.displayName = "${name}";
`;
};
