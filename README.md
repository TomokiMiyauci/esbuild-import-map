# esbuild-import-map

[ESBuild](https://github.com/evanw/esbuild) plugin for
[import-maps](https://github.com/WICG/import-maps#multiple-import-map-support).

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install

deno:

```bash
deno add @miyauci/esbuild-import-map
```

node:

```bash
npx jsr add @miyauci/esbuild-import-map
```

## Usage

`importMap` specifies a JavaScript Object. `baseURL` specifies the URL of import
map.

```ts
import { importMapPlugin } from "@miyauci/esbuild-import-map";
import { build } from "esbuild";

await build({
  stdin: { contents: `import "react";` },
  plugins: [importMapPlugin({
    baseURL: import.meta.resolve("./import_map.json"),
    importMap: {
      imports: { "react": "npm:react@^18" },
    },
  })],
  bundle: true,
  format: "esm",
});
```

## API

See [jsr doc](https://jsr.io/@miyauci/esbuild-import-map) for all APIs.

## Contributing

See [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2024 Tomoki Miyauchi
