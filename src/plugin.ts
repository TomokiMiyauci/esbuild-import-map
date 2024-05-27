import { toFileUrl } from "@std/path/to-file-url";
import { fromFileUrl } from "@std/path/from-file-url";
import { isAbsolute } from "@std/path/is-absolute";
import { type ImportMapJson, parseFromJson } from "import_map";
import { importMapToRegExp } from "./regexp.ts";
import type { Plugin } from "esbuild";

export interface ImportMap {
  imports?: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
}

export interface ImportMapPluginArgs {
  baseURL: URL | string;

  /** Import map as JavaScript Object. */
  importMap: ImportMap;
}

const done = Symbol("done");

/** Create import-map plugin for esbuild.
 *
 * @example
 * ```ts
 * import { importMapPlugin } from "@miyauci/esbuild-import-map";
 * import { build } from "esbuild";
 *
 * await build({
 *   stdin: { contents: `import "react";` },
 *   plugins: [importMapPlugin({
 *     baseURL: import.meta.resolve("./import_map.json"),
 *     importMap: {
 *       imports: { "react": "npm:react@^18" },
 *     },
 *   })],
 *   bundle: true,
 *   format: "esm",
 * });
 * ```
 */
export function importMapPlugin(args: Readonly<ImportMapPluginArgs>): Plugin {
  return {
    name: "import-map",
    async setup(build) {
      const importMapJson = normalize(args.importMap);
      const importMap = await parseFromJson(args.baseURL, importMapJson);
      const filter = importMapToRegExp(importMapJson);

      build.onResolve({ filter }, (args) => {
        const { kind, importer, resolveDir, path, pluginData } = args;

        if (pluginData === done || !isAbsolute(importer)) return;

        const referrer = toFileUrl(importer);
        const resolved = importMap.resolve(path, referrer);
        const specifier = resolved.startsWith("file:")
          ? fromFileUrl(resolved)
          : resolved;

        return build.resolve(specifier, {
          kind,
          importer,
          resolveDir,
          pluginData: done,
        });
      });
    },
  };
}

export function normalize(importMap: ImportMap): ImportMapJson {
  return { imports: importMap.imports ?? {}, scopes: importMap.scopes };
}
