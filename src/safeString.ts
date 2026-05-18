/**
 * Opaque marker that tells the `html` tag to insert a value verbatim
 * instead of HTML-escaping it. Wrap a string in `safe(...)` (or pass
 * the result of a nested `` html`...` `` call) when you really mean to
 * inject raw HTML.
 */
export class SafeString {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}

/** Convenience constructor — mirrors React's `dangerouslySetInnerHTML`. */
export function safe(value: string): SafeString {
  return new SafeString(value);
}

/** Type guard for runtime "is this thing already escaped?" checks. */
export function isSafe(value: unknown): value is SafeString {
  return value instanceof SafeString;
}
