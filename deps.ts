// TODO: replace when externalized
export {
  type ImportMapJson,
  parseFromJson,
} from "./vendor/deno.land/x/import_map@v0.19.1/mod.ts";
export { type Plugin } from "npm:/esbuild@^0.20.2";
export { fromFileUrl, isAbsolute, toFileUrl } from "jsr:/@std/path@^0.225.1";
export { escape } from "jsr:/@std/regexp@^0.224.1";
export { distinct } from "jsr:/@std/collections@^0.224.1";
