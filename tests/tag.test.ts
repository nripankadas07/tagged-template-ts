import { TaggedTemplateError, tag } from "../src/index";

describe("tag factory", () => {
  it("defaults to plain string concatenation", () => {
    const plain = tag();
    expect(plain`a${1}b${true}c`).toBe("a1btruec");
  });

  it("uses a custom escape function", () => {
    const upper = tag<string>({ escape: (v) => String(v).toUpperCase() });
    expect(upper`hello ${"world"}`).toBe("hello WORLD");
  });

  it("uses a custom join function", () => {
    const arrayTag = tag<string[]>({ join: (parts) => Array.from(parts) });
    expect(arrayTag`a${1}b`).toEqual(["a", "1", "b"]);
  });

  it("passes the interpolation index to escape", () => {
    const indexed = tag<string>({ escape: (_v, i) => `<${i}>` });
    expect(indexed`a${"x"}b${"y"}c`).toBe("a<0>b<1>c");
  });

  it("throws when invoked with mismatched arrays", () => {
    const t = tag();
    const strings = ["a", "b"] as unknown as TemplateStringsArray;
    expect(() => t(strings, 1, 2)).toThrow(TaggedTemplateError);
  });

  it("throws when invoked with an empty strings array", () => {
    const t = tag();
    const strings = [] as unknown as TemplateStringsArray;
    expect(() => t(strings)).toThrow(TaggedTemplateError);
  });

  it("handles tags with no interpolations", () => {
    const t = tag();
    expect(t`hello`).toBe("hello");
  });

  it("survives empty literal segments", () => {
    const t = tag();
    expect(t`${"a"}${"b"}`).toBe("ab");
  });
});
