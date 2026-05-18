/**
 * Single error class raised by {@link tagged-template-ts}.
 *
 * Every helper throws this when it is misused — for example, when a
 * tag is invoked manually with a mismatched number of values, or when
 * a SQL parameter pre-bound count is invalid.
 */
export class TaggedTemplateError extends Error {
  public override readonly name = "TaggedTemplateError" as const;

  public constructor(message: string) {
    super(message);
    // Keep prototype chain healthy in down-level emit targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
