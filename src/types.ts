/**
 * Public type aliases for {@link tagged-template-ts}.
 *
 * A {@link TaggedTemplate} is a function callable as
 * `` tag`text ${value} more text` `` — the runtime hands us a frozen
 * `TemplateStringsArray` of literal segments and the interpolated
 * values. The generic parameter is the value type each tag produces
 * (a `string`, a structured `SqlQuery`, a `RegExp`, etc.).
 */

export type TaggedTemplate<TResult> = (
  strings: TemplateStringsArray,
  ...values: ReadonlyArray<unknown>
) => TResult;

/**
 * Per-interpolation escaper. Receives the raw user value and the
 * zero-based index of the interpolation. The string it returns is
 * inserted verbatim between the surrounding literal segments.
 */
export type Escape = (value: unknown, index: number) => string;

/**
 * Final-assembly joiner. Receives the alternating sequence
 * `[literal, escaped, literal, escaped, ..., literal]` and produces
 * the tag's result. The default joiner simply concatenates with `""`.
 */
export type Join<TResult> = (parts: ReadonlyArray<string>) => TResult;

/** Options accepted by the {@link tag} factory. */
export interface TagOptions<TResult = string> {
  /** Override the per-value escaper. Default: coerce to string. */
  escape?: Escape;
  /** Override the final-assembly step. Default: ``parts.join("")``. */
  join?: Join<TResult>;
}

/** Postgres-style structured SQL query result. */
export interface SqlQuery {
  /** SQL text with `$1`, `$2`, ... placeholder markers. */
  readonly text: string;
  /** Values to bind, indexed by placeholder number minus one. */
  readonly values: ReadonlyArray<unknown>;
}
