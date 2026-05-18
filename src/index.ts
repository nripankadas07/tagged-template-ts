/**
 * Public entry point for `tagged-template-ts`.
 *
 * Each named export is either a tagged template (callable as
 * `` html`<p>${name}</p>` ``), a tag *factory* (`regex`), an escape
 * helper (`escapeHtml`, `escapeRegex`, `quoteCsvField`,
 * `encodeUrlPath`, `coerce`), or a type/class.
 */

export { csv } from "./csv";
export { dedent, dedentString } from "./dedent";
export { TaggedTemplateError } from "./errors";
export {
  coerce,
  encodeUrlPath,
  escapeHtml,
  escapeRegex,
  quoteCsvField,
} from "./escape";
export { html } from "./html";
export { oneline, onelineString } from "./oneline";
export { raw } from "./raw";
export { regex } from "./regex";
export { SafeString, isSafe, safe } from "./safeString";
export { sql } from "./sql";
export { tag } from "./tag";
export { urlPath } from "./urlPath";
export type {
  Escape,
  Join,
  SqlQuery,
  TagOptions,
  TaggedTemplate,
} from "./types";
