/**
 * Raw tagged template — like {@link String.raw} but with a guard for
 * missing interpolations and tolerant of any value type.
 *
 * The "raw" form preserves escape sequences verbatim (``\n`` stays as
 * the two characters ``\`` and ``n`` rather than a newline character).
 * Interpolated values are coerced with the standard rules.
 */

import { TaggedTemplateError } from "./errors";
import { coerce } from "./escape";
import type { TaggedTemplate } from "./types";

export const raw: TaggedTemplate<string> = (strings, ...values) => {
  if (!strings.raw) {
    throw new TaggedTemplateError("raw template strings are unavailable");
  }
  const segments = strings.raw;
  if (segments.length !== values.length + 1) {
    throw new TaggedTemplateError(
      `expected ${segments.length - 1} value(s), got ${values.length}`,
    );
  }
  let out = "";
  for (let i = 0; i < segments.length; i += 1) {
    out += segments[i] as string;
    if (i < values.length) {
      out += coerce(values[i]);
    }
  }
  return out;
};
