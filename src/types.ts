/** Import map definition. */
export interface ImportMap {
  /** A map of specifiers to their remapped specifiers. */
  imports?: Record<string, string | null>;

  /** Define a scope which remaps a specifier in only a specified scope. */
  scopes?: Record<string, Record<string, string | null>>;
}
