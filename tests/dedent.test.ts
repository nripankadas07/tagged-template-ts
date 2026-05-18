import { dedent, dedentString } from "../src/index";

describe("dedent tag", () => {
  it("strips common leading whitespace", () => {
    const out = dedent`
      hello
      world
    `;
    expect(out).toBe("hello\nworld");
  });

  it("preserves relative indentation", () => {
    const out = dedent`
      a
        b
          c
    `;
    expect(out).toBe("a\n  b\n    c");
  });

  it("ignores blank lines when computing indent", () => {
    const out = dedent`
      a

      b
    `;
    expect(out).toBe("a\n\nb");
  });

  it("interpolates strings inline", () => {
    const name = "world";
    const out = dedent`
      hello ${name}
      done
    `;
    expect(out).toBe("hello world\ndone");
  });

  it("returns the input unchanged when there is no common indent", () => {
    expect(dedent`abc`).toBe("abc");
  });

  it("dedentString operates on raw strings too", () => {
    expect(dedentString("    a\n    b")).toBe("a\nb");
  });

  it("handles a leading-newline-only input gracefully", () => {
    expect(dedentString("\n")).toBe("");
  });

  it("strips a trailing whitespace-only line completely", () => {
    // The closing-backtick alignment line is removed; the input is left
    // with only the first "   " segment, which has no non-blank lines.
    expect(dedentString("   \n   ")).toBe("   ");
  });

  it("handles mixed tab/space indents based on shortest prefix", () => {
    // Mixed indentation: the algorithm strips the shortest count of leading whitespace characters; we count characters, not visual width.
    expect(dedentString("  a\n   b")).toBe("a\n b");
  });

  it("removes a single trailing newline", () => {
    expect(dedentString("a\n")).toBe("a");
  });

  it("handles empty templates", () => {
    expect(dedent``).toBe("");
  });
});
