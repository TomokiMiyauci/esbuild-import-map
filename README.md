# esbuild-import-map

[![JSR](https://jsr.io/badges/@miyauci/esbuild-import-map)](https://jsr.io/@miyauci/esbuild-import-map)
[![codecov](https://codecov.io/gh/TomokiMiyauci/esbuild-import-map/graph/badge.svg?token=mdFquW0o8i)](https://codecov.io/gh/TomokiMiyauci/esbuild-import-map)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/esbuild-import-map)](https://github.com/TomokiMiyauci/esbuild-import-map/blob/main/LICENSE)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

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
