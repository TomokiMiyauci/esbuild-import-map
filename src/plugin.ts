import { parseFromJson } from "@deno/import_map";
import type { Plugin } from "esbuild";
import { importMapToRegExp } from "./regexp.ts";
import { resolveReferrer } from "./referrer.ts";
import { normalizeImportMap, normalizeSpecifier } from "./utils.ts";
import type { ImportMap } from "./types.ts";

/** Import map location URL and it's value. */
export interface ImportMapResource {
  /** Import map location URL.
   *
   * @example string
   * "file:///path/to/import_map.json"
   */
  url: URL | string;

  /** Import map as JavaScript Object. */
  importMap: ImportMap;
}

const done = Symbol("done");

/** Create import-map plugin for esbuild.
 *
 * @example Basic usage
 * ```ts
 * import { importMapPlugin } from "@miyauci/esbuild-import-map";
 * import { build } from "esbuild";
 *
 * await build({
 *  stdin: { contents: `import "@/mod.ts";`, resolveDir: import.meta.dirname },
 *  plugins: [importMapPlugin({
 *    url: import.meta.resolve("./import_map.json"),
 *    importMap: {
 *      imports: { "@/": "./src/" },
 *    },
 *  })],
 *  bundle: true,
 *  format: "esm",
 * });
 * ```
 */
export function importMapPlugin(resource: Readonly<ImportMapResource>): Plugin {
  return {
    name: "import-map",
    async setup(build) {
      const importMapJson = normalizeImportMap(resource.importMap);
      const filter = importMapToRegExp(importMapJson);

      if (!filter) return;

      const importMap = await parseFromJson(resource.url, importMapJson);

      build.onResolve({ filter }, (args) => {
        const { kind, importer, resolveDir, path, pluginData } = args;

        if (pluginData === done) return;

        const referrer = resolveReferrer(args);
        const resolved = importMap.resolve(path, referrer);
        const specifier = normalizeSpecifier(resolved);

        return build.resolve(specifier, {
          kind,
          importer,
          resolveDir,
          pluginData: done,
          with: args.with,
        });
      });
    },
  };
}
