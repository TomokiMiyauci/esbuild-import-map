import { importMapPlugin } from "./plugin.ts";
import { afterAll, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { build, type BuildOptions, stop } from "esbuild";

const baseOptions = {
  stdin: {
    contents: `import "@";`,
    resolveDir: import.meta.dirname,
  },
  bundle: true,
  write: false,
  format: "esm",
} satisfies BuildOptions;

describe("importMapPlugin", () => {
  afterAll(async () => {
    await stop();
  });

  it("should throw error", async () => {
    await expect(
      build({
        ...baseOptions,
        plugins: [
          importMapPlugin({
            url: import.meta.resolve("./import_map.json"),
            importMap: { imports: { "@": null } },
          }),
        ],
      }),
    ).rejects.toThrow();
  });

  it("should resolve", async () => {
    await expect(
      build({
        ...baseOptions,
        plugins: [
          importMapPlugin({
            url: import.meta.resolve("./import_map.json"),
            importMap: { imports: { "@": "node:test" } },
          }),
        ],
        external: ["node:test"],
      }),
    ).resolves.toBeTruthy();
  });
});
