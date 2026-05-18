/**
 * URL path tagged template.
 *
 * Percent-encodes each interpolation with ``encodeURIComponent``, so
 * slashes and reserved characters inside a value never break out of
 * the path segment they were meant for. The literal segments are
 * preserved verbatim (so you can keep your own ``/`` separators).
 */

import { encodeUrlPath } from "./escape";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

export const urlPath: TaggedTemplate<string> = tag({
  escape: (value) => encodeUrlPath(value),
});
