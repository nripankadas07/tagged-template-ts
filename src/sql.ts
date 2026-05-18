/**
 * Postgres-style parameterized SQL tagged template.
 *
 * Each interpolation produces a ``$N`` placeholder, where *N* is the
 * 1-based position of the value across the whole query. The result is
 * a structured {@link SqlQuery} you can hand straight to `pg`-style
 * drivers, with the literal segments preserved verbatim.
 */

import { TaggedTemplateError } from "./errors";
import type { SqlQuery, TaggedTemplate } from "./types";

export const sql: TaggedTemplate<SqlQuery> = (strings, ...values) => {
  if (strings.length === 0) {
    throw new TaggedTemplateError("strings array must not be empty");
  }
  if (strings.length !== values.length + 1) {
    throw new TaggedTemplateError(
      `expected ${strings.length - 1} value(s), got ${values.length}`,
    );
  }
  let text = "";
  for (let i = 0; i < strings.length; i += 1) {
    text += strings[i] as string;
    if (i < values.length) {
      text += `$${i + 1}`;
    }
  }
  return { text, values: [...values] };
};
