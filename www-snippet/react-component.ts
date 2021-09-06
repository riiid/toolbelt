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

export const createReactComponentStoriesContent = (
  name: string,
  option: ReactComponentOption,
) => {
  return `import React from "react";
import { Story } from "@storybook/react";
import ${name}, { ${name}Props } from ".";

export const Gallery: Story = () => {
  return (
    <${name}></${name}>
  );
};

export const Template: Story<${name}Props> = (props) => {
  return <${name} {...props} />;
};

Template.args = {
  children: "Lorem Ipsum",
};

export default {
  title: "Components/${name}",
  component: ${name},
  parameters: {
    backgrounds: {
      default: "dark",
    },
    layout: "fullscreen",
    viewport: {
      defaultViewport: "galaxys5",
    },
  },
  decorators: [
    (Story: Story) => (
      <Story />
    ),
  ],
};`;
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
});`;
};
