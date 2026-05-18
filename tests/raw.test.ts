import { raw, TaggedTemplateError } from "../src/index";

describe("raw tag", () => {
  it("preserves escape sequences as literal text", () => {
    expect(raw`a\n${"b"}`).toBe("a\\nb");
  });

  it("works on multi-line templates", () => {
    const out = raw`a\t${1}\n${"b"}`;
    expect(out).toBe("a\\t1\\nb");
  });

  it("handles empty templates", () => {
    expect(raw``).toBe("");
  });

  it("throws when invoked manually without a raw array", () => {
    const strings = ["a", "b"] as unknown as TemplateStringsArray;
    // Force raw to undefined to exercise the guard.
    Object.defineProperty(strings, "raw", { value: undefined });
    expect(() => raw(strings, 1)).toThrow(TaggedTemplateError);
  });

  it("throws when invoked with a length mismatch", () => {
    const strings = Object.assign(["a", "b"], { raw: ["a", "b"] }) as unknown as TemplateStringsArray;
    expect(() => raw(strings, 1, 2)).toThrow(TaggedTemplateError);
  });

  it("coerces non-string interpolations", () => {
    expect(raw`v=${42}`).toBe("v=42");
    expect(raw`b=${false}`).toBe("b=false");
    expect(raw`n=${null}`).toBe("n=");
  });
});
