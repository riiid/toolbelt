export interface ReactComponentOption {
  forwardRef?: boolean;
}

export const createReactComponentContent = (
  name: string,
  option: ReactComponentOption,
) => {
  if (!option.forwardRef) {
    return `import React, { memo, PropsWithChildren } from "react";
export interface ${name}Props {}

const ${name} = (({}: PropsWithChildren<${name}Props>) => {
  return <>${name}</>;
});

export default memo(${name});
`;
  }

  return `import React, { forwardRef, memo } from "react";
type TypeRef = any;

export interface ${name}Props {}

const ${name} = forwardRef<TypeRef, ${name}Props>(({}, ref) => {
  return <>${name}</>;
});

export default memo(${name});

${name}.displayName = "${name}";
`;
};

export const createReactComponentStoriesContent = (
  name: string,
  option: ReactComponentOption,
) => {
  return `import React, { forwardRef, memo } from "react";

type RefElement = HTMLDivElement;
type RefElementProps = React.HTMLAttributes<HTMLDivElement>;

export interface ${name}Props extends RefElementProps {}

const ${name} = forwardRef<RefElement, ${name}Props>((props, ref) => {
  return <div ref={ref} {...props}>Lorem Ipsum</div>;
});

export default memo(${name});

${name}.displayName = "${name}";
`;
};

export const createReactComponentTestingContent = (
  name: string,
  option: ReactComponentOption,
) => {
  return `import { render } from "@testing-library/react";

import ${name} from ".";

describe("<${name} />", () => {
  it("should render children correctly", () => {
    const content = "Lorem Ipsum";
    const { queryByText } = render(<${name}>{content}</${name}>);
    expect(queryByText("Lorem Ipsum")).toBeInTheDocument();
  });
});
`;
};

export const createReactComponentReExportContent = (
  name: string,
  option: ReactComponentOption,
) => {
  return `export { default } from './LoremIpsum';
export * from './LoremIpsum';
`;
};
