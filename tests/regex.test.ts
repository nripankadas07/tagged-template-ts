import { regex, TaggedTemplateError } from "../src/index";

describe("regex tag", () => {
  it("auto-escapes interpolated literals", () => {
    const userInput = "a.b+c";
    const re = regex()`^${userInput}$`;
    expect(re.test("a.b+c")).toBe(true);
    expect(re.test("aXbYc")).toBe(false);
  });

  it("compiles with the supplied flags", () => {
    const re = regex("gi")`hello`;
    expect(re.flags).toBe("gi");
    expect("Hello HELLO".match(re)?.length).toBe(2);
  });

  it("inlines existing RegExp sub-patterns verbatim", () => {
    const word = /\w+/;
    const re = regex()`^${word}@example\.com$`;
    expect(re.test("alice@example.com")).toBe(true);
  });

  it("handles empty templates", () => {
    expect(regex()``.source).toBe("(?:)"); // Node's empty-pattern canonical form
  });

  it("rejects unknown flags", () => {
    expect(() => regex("z")).toThrow(TaggedTemplateError);
  });

  it("rejects duplicate flags", () => {
    expect(() => regex("gg")).toThrow(TaggedTemplateError);
  });

  it("accepts the no-flag default", () => {
    expect(regex()`x`.flags).toBe("");
  });

  it("escapes characters that would otherwise change the meaning", () => {
    const re = regex()`^${"$"}$`;
    expect(re.test("$")).toBe(true);
  });
});
