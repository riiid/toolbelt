interface ReactComponentOption {
  forwardRef?: boolean;
}

export const createReactComponentContent = (
  name: string,
  option: ReactComponentOption,
) => {
  if (!option.forwardRef) {
    return `import React, { PropsWithChildren, memo } from "react";
export interface ${name}Props {}

const ${name} = (({}: PropsWithChildren<${name}Props>) => {
  return <>${name}</>;
});

export default memo(${name});`;
  }

  return `import React, { forwardRef, memo } from "react";
type TypeRef = any;

export interface ${name}Props {}

const ${name} = forwardRef<TypeRef, ${name}Props>(({}, ref) => {
  return <>${name}</>;
});

export default memo(${name});

${name}.displayName = "${name}";`;
};

export const createReactComponentTestingContent = (name: string) => {
};
