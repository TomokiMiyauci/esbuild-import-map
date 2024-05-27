import {
  fromFileUrl,
  type ImportMapJson,
  isAbsolute,
  parseFromJson,
  type Plugin,
  toFileUrl,
} from "../deps.ts";
import { importMapToRegExp } from "./regexp.ts";

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
