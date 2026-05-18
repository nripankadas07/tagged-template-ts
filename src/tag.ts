/**
 * Generic tag factory used by every bundled tag and exposed publicly
 * for callers that want to build their own.
 */

import { TaggedTemplateError } from "./errors";
import { coerce } from "./escape";
import type { Escape, Join, TagOptions, TaggedTemplate } from "./types";

/**
 * Build a new tagged-template function.
 *
 * The factory walks the literal segments and interpolated values in
 * lockstep, applies *escape* to each value (default: stringify), then
 * hands the alternating ``[literal, escaped, literal, ...]`` parts to
 * *join* (default: ``parts.join("")``).
 */
export function tag<TResult = string>(
  options: TagOptions<TResult> = {},
): TaggedTemplate<TResult> {
  const escape: Escape = options.escape ?? defaultEscape;
  const join: Join<TResult> = options.join ?? (defaultJoin as Join<TResult>);
  return (strings, ...values) => {
    assertWellFormed(strings, values);
    const parts: string[] = [];
    for (let i = 0; i < strings.length; i += 1) {
      parts.push(strings[i] as string);
      if (i < values.length) {
        parts.push(escape(values[i], i));
      }
    }
    return join(parts);
  };
}

function defaultEscape(value: unknown): string {
  return coerce(value);
}

function defaultJoin(parts: ReadonlyArray<string>): string {
  return parts.join("");
}

function assertWellFormed(
  strings: TemplateStringsArray,
  values: ReadonlyArray<unknown>,
): void {
  if (strings.length === 0) {
    throw new TaggedTemplateError("strings array must not be empty");
  }
  if (strings.length !== values.length + 1) {
    throw new TaggedTemplateError(
      `expected ${strings.length - 1} value(s), got ${values.length}`,
    );
  }
}
