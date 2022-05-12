import { createImportRaw } from "./createImportRaw.ts";
import { CreateReactComponentOption } from "./CreateReactComponentOption.ts";

export const createReactComponentStoriesContent = (
  name: string,
  option: CreateReactComponentOption,
) => {
  return `import React from "react";
import { Story } from "@storybook/react";
${
    createImportRaw(
      option.onlyNamedExport ? undefined : name,
      option.onlyNamedExport ? [name, `${name}Props`] : [`${name}Props`],
      `./${name}`,
    )
  }

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
};
`;
};
