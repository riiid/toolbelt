import { createImportRaw } from "./createImportRaw.ts";
import { CreateReactComponentOption } from "./CreateReactComponentOption.ts";

export const createReactComponentTestingContent = (
  name: string,
  option: CreateReactComponentOption,
) => {
  return `import { render } from "@testing-library/react";
${
    createImportRaw(
      option.onlyNamedExport ? undefined : name,
      option.onlyNamedExport ? [name] : undefined,
      `./${name}`,
    )
  }

describe("<${name} />", () => {
  it("should render children correctly", () => {
    const content = "Lorem Ipsum";
    const { queryByText } = render(<${name}>{content}</${name}>);
    expect(queryByText("Lorem Ipsum")).toBeInTheDocument();
  });
});
`;
};
