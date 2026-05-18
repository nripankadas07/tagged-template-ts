/**
 * HTML-escaping tagged template. Returns a {@link SafeString} so the
 * result composes naturally with itself: ``html`<p>${html`<b>${x}</b>`}</p>` ``
 * never double-escapes.
 */

import { escapeHtml } from "./escape";
import { SafeString } from "./safeString";
import { tag } from "./tag";
import type { TaggedTemplate } from "./types";

export const html: TaggedTemplate<SafeString> = tag<SafeString>({
  escape: (value) => escapeHtml(value),
  join: (parts) => new SafeString(parts.join("")),
});
