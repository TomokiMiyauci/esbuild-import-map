import { normalizeImportMap, normalizeSpecifier } from "./utils.ts";
import type { ImportMap } from "./types.ts";
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import type { ImportMapJson } from "import_map";

describe("normalizeImportMap", () => {
  it("should return normalized import map", () => {
    const table: [ImportMap, ImportMapJson][] = [
      [{}, { imports: {} }],
      [{ imports: {} }, { imports: {} }],
      [{ imports: {}, scopes: {} }, { imports: {}, scopes: {} }],
      [{ imports: { "": "" } }, { imports: { "": "" } }],
      [{ imports: { "": null } }, { imports: {} }],
      [{ scopes: { "": {} } }, { imports: {}, scopes: { "": {} } }],
      [{ scopes: { "": { "": "" } } }, {
        imports: {},
        scopes: { "": { "": "" } },
      }],
      [{ scopes: { "": { "": null } } }, {
        imports: {},
        scopes: { "": {} },
      }],
      [{ scopes: { "": { "": null, "a": "a" } } }, {
        imports: {},
        scopes: { "": { "a": "a" } },
      }],
    ];

    for (const [importMap, expected] of table) {
      expect(normalizeImportMap(importMap)).toEqual(expected);
    }
  });
});

describe("normalizeSpecifier", () => {
  it("should return path if input is file url", () => {
    const table: [string, string][] = [
      ["file:///", "/"],
      ["file:///path/to", "/path/to"],
    ];

    for (const [specifier, expected] of table) {
      expect(normalizeSpecifier(specifier)).toBe(expected);
    }
  });

  it("should return same value", () => {
    const table: [string, string][] = [
      ["", ""],
      ["file", "file"],
      ["file:", "file:"],
      ["file:/", "file:/"],
      ["file://", "file://"],
      ["/", "/"],
      ["./", "./"],
      ["../", "../"],
    ];

    for (const [specifier, expected] of table) {
      expect(normalizeSpecifier(specifier)).toBe(expected);
    }
  });
});
