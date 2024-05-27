import { describe, expect, it } from "../dev_deps.ts";
import { type ImportMapLike, importMapToRegExp } from "./regexp.ts";

describe("importMapToRegExp", () => {
  it("should return empty regexp", () => {
    const table: ImportMapLike[] = [
      {},
      { imports: {} },
      { scopes: {} },
      { scopes: { "": {} } },
      { imports: {}, scopes: {} },
    ];

    table.forEach((importMap) => {
      expect(importMapToRegExp(importMap)).toEqual(new RegExp(""));
    });
  });

  it("should pattern keys regardless of its value", () => {
    const expected = new RegExp(/^pkg$/);
    const table: ImportMapLike[] = [
      { imports: { "pkg": "" } },
      { imports: { "pkg": null } },
      { imports: { "pkg": {} } },
      { imports: { "pkg": undefined } },
      { scopes: { "": { "pkg": "" } } },
      { scopes: { "": { "pkg": null } } },
      { scopes: { "": { "pkg": undefined } } },
      { scopes: { "abc": { "pkg": undefined } } },
      { imports: { "pkg": "" }, scopes: { "": { "pkg": undefined } } },
    ];

    table.forEach((importMap) => {
      expect(importMapToRegExp(importMap)).toEqual(expected);
    });
  });

  it("should pattern keys regardless of its value", () => {
    const expected = new RegExp(/^pkg$/);
    const table: ImportMapLike[] = [
      { imports: { "pkg": "" } },
      { imports: { "pkg": null } },
      { imports: { "pkg": {} } },
      { imports: { "pkg": undefined } },
      { scopes: { "": { "pkg": "" } } },
      { scopes: { "": { "pkg": null } } },
      { scopes: { "": { "pkg": undefined } } },
      { scopes: { "abc": { "pkg": undefined } } },
      { imports: { "pkg": "" }, scopes: { "": { "pkg": undefined } } },
    ];

    table.forEach((importMap) => {
      expect(importMapToRegExp(importMap)).toEqual(expected);
    });
  });

  it("should return forward matching pattern if the key ends with slash", () => {
    const expected = new RegExp(/^pkg\//);
    const table: ImportMapLike[] = [
      { imports: { "pkg/": "" } },
      { scopes: { "": { "pkg/": "" } } },
      { imports: { "pkg/": "" }, scopes: { "": { "pkg/": undefined } } },
    ];

    table.forEach((importMap) => {
      expect(importMapToRegExp(importMap)).toEqual(expected);
    });
  });

  it("should combine into one if duplicated", () => {
    expect(importMapToRegExp({
      imports: { "pkg/": "" },
      scopes: {
        "": { "pkg/": "" },
        "a": { "pkg/": "" },
        "b": { "pkg/": "" },
        "c": { "pkg/": "" },
      },
    })).toEqual(new RegExp(/^pkg\//));
  });

  it("should join by `|` if multiple keys exist", () => {
    const table: [ImportMapLike, RegExp][] = [
      [{ imports: { "pkg": "", "pkg/": "" } }, /^pkg$|^pkg\//],
      [{
        imports: { "pkg": "", "pkg/": "", "pkg//": "" },
        scopes: {
          "": { "pkg///": "" },
        },
      }, /^pkg$|^pkg\/|^pkg\/\/|^pkg\/\/\//],
    ];

    table.forEach(([importMap, expected]) => {
      expect(importMapToRegExp(importMap)).toEqual(expected);
    });
  });
});
