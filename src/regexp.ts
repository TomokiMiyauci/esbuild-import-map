import { distinct } from "@std/collections/distinct";
import { escape } from "@std/regexp";

export interface ImportMapLike {
  imports?: Record<string, unknown>;
  scopes?: Record<string, Record<string, unknown>>;
}

export function importMapToRegExp(importMap: ImportMapLike): RegExp {
  const { scopes = {}, imports = {} } = importMap;
  const importsKeys = Object.keys(imports);
  const scopesKeys = Object.values(scopes).flatMap(Object.keys.bind(Object));
  const allKeys = distinct([...importsKeys, ...scopesKeys]);
  const pattern = allKeys.map(escape).map(wrapByMatcher).join("|");

  return new RegExp(pattern);
}

export function wrapByMatcher(input: string): `^${string}$` | `^${string}` {
  return input.endsWith("/") ? `^${input}` : `^${input}$`;
}
