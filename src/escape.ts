/**
 * Free-standing escape utilities reused by the bundled tags. Each
 * helper accepts any value, coerces it to a string via the helpers
 * below, then applies its specific quoting rules.
 */

import { isSafe } from "./safeString";

const HTML_ENTITIES: Readonly<Record<string, string>> = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#47;",
  "`": "&#96;",
  "=": "&#61;",
});

const HTML_REPLACE_RE = /[&<>"'`/=]/g;

/**
 * Coerce *value* to a string the way template literals do.
 *
 * Differences from the built-in: `null` and `undefined` become the
 * empty string (matching the html / sql / url helpers' expectation
 * that an absent value should not appear in the output).
 */
export function coerce(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map((entry) => coerce(entry)).join("");
  }
  if (isSafe(value)) {
    return value.value;
  }
  return String(value);
}

/** HTML-escape *value*; pre-marked {@link SafeString} pass through verbatim. */
export function escapeHtml(value: unknown): string {
  if (isSafe(value)) {
    return value.value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => escapeHtml(entry)).join("");
  }
  return coerce(value).replace(HTML_REPLACE_RE, (char) => HTML_ENTITIES[char] as string);
}

/** Backslash-escape every RegExp metacharacter in *value*. */
export function escapeRegex(value: unknown): string {
  return coerce(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * RFC-4180 CSV field quoting.
 *
 * The field is wrapped in double quotes if (and only if) it contains a
 * comma, double quote, CR, or LF; embedded double quotes are doubled.
 * Everything else passes through.
 */
export function quoteCsvField(value: unknown): string {
  const text = coerce(value);
  if (!/[",\r\n]/.test(text)) {
    return text;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

/** Percent-encode every character that is not a URL-path-safe one. */
export function encodeUrlPath(value: unknown): string {
  return encodeURIComponent(coerce(value));
}
