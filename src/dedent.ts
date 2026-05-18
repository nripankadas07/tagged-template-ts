/**
 * Dedent tagged template.
 *
 * Computes the common leading whitespace prefix across all non-blank
 * lines and strips it from every line. A single leading newline and a
 * single trailing newline are also removed so the template can be
 * written naturally with the opening backtick on its own line.
 *
 * Interpolated values are coerced to strings and inserted **before**
 * dedenting, so multi-line interpolations are aligned correctly when
 * they appear at the start of a line.
 */

import { coerce } from "./escape";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

export const dedent: TaggedTemplate<string> = tag({
  join: (parts) => dedentString(parts.join("")),
  escape: (value) => coerce(value),
});

export function dedentString(text: string): string {
  const stripped = stripWrappingNewlines(text);
  const lines = stripped.split("\n");
  const indent = commonIndent(lines);
  if (indent === 0) {
    return stripped;
  }
  return lines.map((line) => line.slice(indent)).join("\n");
}

function stripWrappingNewlines(text: string): string {
  let body = text;
  if (body.startsWith("\n")) {
    body = body.slice(1);
  }
  const trailingBlank = body.match(/\n[ \t]*$/);
  if (trailingBlank) {
    body = body.slice(0, trailingBlank.index);
  }
  return body;
}

function commonIndent(lines: ReadonlyArray<string>): number {
  let indent = Infinity;
  for (const line of lines) {
    if (line.trim() === "") {
      continue;
    }
    const leading = leadingWhitespace(line);
    if (leading < indent) {
      indent = leading;
    }
  }
  return indent === Infinity ? 0 : indent;
}

function leadingWhitespace(line: string): number {
  let count = 0;
  while (count < line.length && (line[count] === " " || line[count] === "\t")) {
    count += 1;
  }
  return count;
}
