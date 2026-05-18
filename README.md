# tagged-template-ts

Type-safe, zero-dep collection of tagged-template helpers for TypeScript —
`html`, `sql`, `dedent`, `oneline`, `raw`, `regex`, `urlPath`, `csv`, and a
`tag()` factory for building your own.

```ts
import { html, sql, dedent, urlPath } from "tagged-template-ts";

const name = "<script>";
const greeting = html`<h1>Hello, ${name}!</h1>`;
// SafeString { value: "<h1>Hello, &lt;script&gt;!</h1>" }

const query = sql`SELECT * FROM users WHERE id = ${42}`;
// { text: "SELECT * FROM users WHERE id = $1", values: [42] }

const message = dedent`
  hello
    world
`;
// "hello\n  world"

const url = urlPath`/users/${"alice/bob"}`;
// "/users/alice%2Fbob"
```

* **Zero runtime dependencies** — pure TypeScript, ships compiled `.js`
  + `.d.ts`.
* **`tsc --strict` clean** with `exactOptionalPropertyTypes`,
  `noImplicitAny`, `noUnusedLocals`, and the rest of the strictness
  panel enabled.
* **100% statements / branches / functions / lines** coverage —
  97 tests on Node 18+.
* **Composable** — `html` returns a `SafeString` that nests without
  double-escaping; `regex` inlines existing `RegExp` source verbatim;
  `tag()` lets you wire a custom escape + join pair in two lines.

## Install

```
npm install tagged-template-ts
```

## The bundled tags

### `html` — XSS-safe HTML

```ts
const items = ["a", "b<c>"];
const list = html`
  <ul>${items.map((item) => html`<li>${item}</li>`)}</ul>
`;
```

Escapes `&`, `<`, `>`, `"`, `'`, `` ` ``, `/`, and `=`. Arrays are
recursively escaped. A `SafeString` (returned by `html` itself, or
constructed with `safe(str)`) is inserted verbatim — so nested
`html` calls never double-escape.

### `sql` — parameterized SQL

```ts
sql`SELECT * FROM x WHERE a = ${1} AND b = ${"two"}`
// → { text: "SELECT * FROM x WHERE a = $1 AND b = $2", values: [1, "two"] }
```

Postgres-style `$N` placeholders. Each interpolation produces one
slot in the `values` array, in source order. `null` and `undefined`
are preserved as bind values (not coerced to strings).

### `dedent` — strip common leading whitespace

```ts
dedent`
  hello
    world
`
// "hello\n  world"
```

The common leading-whitespace prefix is computed across non-blank
lines and stripped from every line; a leading newline and any
all-whitespace trailing line are removed so the template can be
laid out with the backticks on their own lines.

### `oneline` — collapse all whitespace

```ts
oneline`
  Hello,
  world!
`
// "Hello, world!"
```

Runs of whitespace (including newlines and tabs) become a single
space, then the result is trimmed.

### `raw` — keep escape sequences literal

```ts
raw`a\n${"b"}`
// "a\\nb"   (the \n is two characters)
```

Like `String.raw`, but tolerant of any value type and with a clear
error message on length mismatch.

### `regex` — auto-escaping `RegExp` factory

```ts
const userInput = "a.b+c";
const re = regex("i")`^${userInput}$`;
re.test("a.b+c");  // true
re.test("aXbYc");  // false
```

Interpolated strings are passed through `escapeRegex`; existing
`RegExp` values are inlined as their `.source` (no re-escape) so you
can compose sub-patterns.

### `urlPath` — `encodeURIComponent` per interpolation

```ts
urlPath`/users/${"a/b c"}/profile`
// "/users/a%2Fb%20c/profile"
```

Literal slashes in the template are preserved; slashes inside
interpolations are percent-encoded.

### `csv` — RFC-4180 CSV fields

```ts
csv`${1},${"Alice"},${"loves, commas"}`
// '1,Alice,"loves, commas"'
```

Fields containing commas, quotes, CR, or LF are wrapped in double
quotes; embedded quotes are doubled. Arrays are comma-joined with
each element individually quoted.

## Building your own tag

```ts
import { tag } from "tagged-template-ts";

const upper = tag<string>({
  escape: (value) => String(value).toUpperCase(),
});

upper`hello ${"world"}`;  // "hello WORLD"
```

`tag()` accepts an `escape` (per-value coercer) and a `join` (final
assembly) callback. Both are optional; defaults stringify each value
and concatenate. The factory enforces a `strings.length ===
values.length + 1` invariant and throws a `TaggedTemplateError`
otherwise.

## Helpers

`escapeHtml`, `escapeRegex`, `quoteCsvField`, `encodeUrlPath`, and
`coerce` are exported as standalone functions in case you need to
escape outside a tagged template. The `SafeString` class, plus
`safe()` and `isSafe()`, let you mark already-trusted HTML so it
flows through the `html` tag untouched.

## Running the tests

```
npm install
npm test         # jest --coverage, requires 100% on every axis
npm run typecheck
```

## License

MIT. See [`LICENSE`](LICENSE).
