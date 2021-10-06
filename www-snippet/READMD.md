# www-snippet

total code snippets of www chapter.


## create-react-component


Usage: create-react-component <dir:string> <name:string>

Description:


  react component snippet.
  includes component, test, storybook, re-export.

  example.

  - create-react-component src/components HelloWorld


Options:

  -h, --help        - Show this help.
  -F, --forwardRef  - generate forwardRef component


## organize-import-path


Usage: organize-import-path <pkg:string>

Description:

this tool organize import path using given path below src folder.

1. it remove all subpath about given path.
2. it change every imports to named imports from given path

for example.
```sh
organize-import-path @riiid/design-system-react
```
```typescript
import Button, {ButtonProps} from '@riiid/design-system-react/lib/components/Button'; // before
import { Button, ButtonProps } from '@riiid/design-system-react'; // after
```

