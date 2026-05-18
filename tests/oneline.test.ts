import { oneline, onelineString } from "../src/index";

describe("oneline tag", () => {
  it("collapses runs of whitespace", () => {
    expect(oneline`hello    world`).toBe("hello world");
  });

  it("collapses real newlines and tabs", () => {
    // Template-literal `\n` is a real newline; `\t` a real tab. Whitespace runs collapse to one space.
    expect(oneline`a\n\t\tb`).toBe("a b");
  });

  it("collapses a true multi-line literal", () => {
    const out = oneline`
      first
      second
    `;
    expect(out).toBe("first second");
  });

  it("trims leading and trailing whitespace", () => {
    expect(oneline`   x   `).toBe("x");
  });

  it("interpolates values", () => {
    expect(oneline`a ${"b"} c`).toBe("a b c");
  });

  it("returns empty for whitespace-only", () => {
    expect(oneline`   \n   `).toBe("");
  });

  it("onelineString operates on raw strings", () => {
    expect(onelineString("a\n  b")).toBe("a b");
  });

  it("handles empty templates", () => {
    expect(oneline``).toBe("");
  });
});
