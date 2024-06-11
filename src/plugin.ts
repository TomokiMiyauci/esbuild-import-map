import { fromFileUrl } from "@std/path/from-file-url";
import { type ImportMapJson, parseFromJson } from "import_map";
import { importMapToRegExp } from "./regexp.ts";
import { resolveReferrer } from "./referrer.ts";
import type { Plugin } from "esbuild";

/** Import map definition. */
export interface ImportMap {
  /** A map of specifiers to their remapped specifiers. */
  imports?: Record<string, string>;

  /** Define a scope which remaps a specifier in only a specified scope. */
  scopes?: Record<string, Record<string, string>>;
}

/** Import map location URL and it's value. */
export interface ImportMapResource {
  /** Import map location URL. */
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
 *   stdin: { contents: `import "react";` },
 *   plugins: [importMapPlugin({
 *     url: import.meta.resolve("./import_map.json"),
 *     importMap: {
 *       imports: { "react": "npm:react@^18" },
 *     },
 *   })],
 *   bundle: true,
 *   format: "esm",
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

export function normalizeImportMap(importMap: ImportMap): ImportMapJson {
  return { imports: importMap.imports ?? {}, scopes: importMap.scopes };
}

export function normalizeSpecifier(specifier: string): string {
  return specifier.startsWith("file:") ? fromFileUrl(specifier) : specifier;
}
