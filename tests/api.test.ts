/**
 * Smoke tests pinning down the public API surface.
 */
import * as api from "../src/index";

describe("public api surface", () => {
  it("exposes every documented callable", () => {
    for (const name of [
      "html",
      "sql",
      "dedent",
      "dedentString",
      "oneline",
      "onelineString",
      "raw",
      "regex",
      "urlPath",
      "csv",
      "tag",
      "escapeHtml",
      "escapeRegex",
      "quoteCsvField",
      "encodeUrlPath",
      "coerce",
      "safe",
      "isSafe",
    ]) {
      expect(typeof (api as Record<string, unknown>)[name]).toBe("function");
    }
  });

  it("exposes the error and SafeString classes", () => {
    expect(typeof api.TaggedTemplateError).toBe("function");
    expect(typeof api.SafeString).toBe("function");
    const err = new api.TaggedTemplateError("boom");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("TaggedTemplateError");
    expect(err.message).toBe("boom");
  });
});
