/**
 * Single-line tagged template.
 *
 * Collapses every run of whitespace (including newlines and tabs) into
 * a single space and trims the result. Useful for inline strings that
 * span multiple source lines for readability but should be emitted as
 * a single line at runtime.
 */

import { coerce } from "./escape";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

export const oneline: TaggedTemplate<string> = tag({
  join: (parts) => onelineString(parts.join("")),
  escape: (value) => coerce(value),
});

export function onelineString(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
