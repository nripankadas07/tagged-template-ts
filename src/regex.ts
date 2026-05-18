/**
 * Regex tagged template factory.
 *
 * ``regex()`` returns a tagged template that auto-escapes every
 * interpolated value as a literal regex match, then compiles the
 * stitched-together pattern into a ``RegExp`` with the supplied
 * flags. Passing an existing ``RegExp`` as an interpolation inserts
 * its source unchanged (handy for composing sub-patterns).
 */

import { TaggedTemplateError } from "./errors";
import { escapeRegex } from "./escape";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

const VALID_FLAGS = "dgimsuy";

export function regex(flags = ""): TaggedTemplate<RegExp> {
  validateFlags(flags);
  return tag<RegExp>({
    escape: (value) => (value instanceof RegExp ? value.source : escapeRegex(value)),
    join: (parts) => new RegExp(parts.join(""), flags),
  });
}

function validateFlags(flags: string): void {
  const seen = new Set<string>();
  for (const flag of flags) {
    if (!VALID_FLAGS.includes(flag)) {
      throw new TaggedTemplateError(`invalid regex flag: ${flag}`);
    }
    if (seen.has(flag)) {
      throw new TaggedTemplateError(`duplicate regex flag: ${flag}`);
    }
    seen.add(flag);
  }
}
