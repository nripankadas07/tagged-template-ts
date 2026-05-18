/**
 * CSV-quoting tagged template (RFC 4180 fields).
 *
 * Each interpolation is treated as a single field: fields containing
 * commas, double quotes, CR, or LF are wrapped in double quotes and
 * the embedded quotes are doubled. Plain fields pass through
 * untouched. Arrays are joined with ``,`` after each element is
 * individually quoted.
 */

import { quoteCsvField } from "./escape";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

export const csv: TaggedTemplate<string> = tag({
  escape: (value) => escapeCsvValue(value),
});

function escapeCsvValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((entry) => quoteCsvField(entry)).join(",");
  }
  return quoteCsvField(value);
}
