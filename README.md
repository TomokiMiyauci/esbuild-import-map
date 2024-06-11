# esbuild-import-map

An [esbuild](https://github.com/evanw/esbuild) plugin for
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

```ts
import { importMapPlugin } from "@miyauci/esbuild-import-map";
import { build } from "esbuild";

await build({
  stdin: { contents: `import "@/mod.ts";`, resolveDir: import.meta.dirname },
  plugins: [importMapPlugin({
    url: import.meta.resolve("./import_map.json"),
    importMap: {
      imports: { "@/": "./src/" },
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
