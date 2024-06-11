import { fromFileUrl } from "@std/path/from-file-url";
import { filterValues } from "@std/collections/filter-values";
import { mapValues } from "@std/collections/map-values";
import type { ImportMapJson } from "@deno/import_map";
import type { ImportMap } from "./types.ts";

export function normalizeImportMap(importMap: ImportMap): ImportMapJson {
  const imports = filterValues(
    importMap?.imports ?? {},
    isString,
  ) as ImportMapJson["imports"];
  const scopes = importMap.scopes &&
    mapValues(
      importMap.scopes,
      (record) => filterValues(record, isString),
    ) as ImportMapJson["scopes"];

  return { imports, scopes };
}

function isString(input: unknown): input is string {
  return typeof input === "string";
}

export function normalizeSpecifier(specifier: string): string {
  return specifier.startsWith("file:///") ? fromFileUrl(specifier) : specifier;
}
