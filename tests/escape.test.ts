import {
  coerce,
  encodeUrlPath,
  escapeHtml,
  escapeRegex,
  isSafe,
  quoteCsvField,
  safe,
  SafeString,
} from "../src/index";

describe("coerce", () => {
  it("returns the empty string for null and undefined", () => {
    expect(coerce(null)).toBe("");
    expect(coerce(undefined)).toBe("");
  });

  it("returns strings unchanged", () => {
    expect(coerce("hello")).toBe("hello");
  });

  it("stringifies numbers, booleans, and bigints", () => {
    expect(coerce(42)).toBe("42");
    expect(coerce(true)).toBe("true");
    expect(coerce(9007199254740993n)).toBe("9007199254740993");
  });

  it("recursively coerces arrays", () => {
    expect(coerce([1, "a", null, [true]])).toBe("1atrue");
  });

  it("unwraps SafeString", () => {
    expect(coerce(safe("<x/>"))).toBe("<x/>");
  });

  it("falls back to String() for objects", () => {
    expect(coerce({ toString: () => "obj" })).toBe("obj");
  });
});

describe("escapeHtml", () => {
  it("escapes &, <, >, \", ', /, `, and =", () => {
    expect(escapeHtml("<a href=\"/x?y=1&z='2'\">")).toBe(
      "&lt;a href&#61;&quot;&#47;x?y&#61;1&amp;z&#61;&#39;2&#39;&quot;&gt;",
    );
  });

  it("passes SafeString through", () => {
    expect(escapeHtml(safe("<i>raw</i>"))).toBe("<i>raw</i>");
  });

  it("recursively escapes arrays of mixed values", () => {
    expect(escapeHtml(["<", safe("<b>"), "&"])).toBe("&lt;<b>&amp;");
  });
});

describe("escapeRegex", () => {
  it("escapes every regex metacharacter", () => {
    expect(escapeRegex("a.b*c+d?e^f$g(h)i{j}k|l[m]n\\o")).toBe(
      "a\\.b\\*c\\+d\\?e\\^f\\$g\\(h\\)i\\{j\\}k\\|l\\[m\\]n\\\\o",
    );
  });

  it("leaves safe characters alone", () => {
    expect(escapeRegex("abc123")).toBe("abc123");
  });
});

describe("quoteCsvField", () => {
  it("does not quote plain text", () => {
    expect(quoteCsvField("plain")).toBe("plain");
  });

  it("quotes commas, newlines, and carriage returns", () => {
    expect(quoteCsvField("a,b")).toBe('"a,b"');
    expect(quoteCsvField("a\nb")).toBe('"a\nb"');
    expect(quoteCsvField("a\rb")).toBe('"a\rb"');
  });

  it("doubles quotes inside quoted values", () => {
    expect(quoteCsvField('he said "hi"')).toBe('"he said ""hi"""');
  });
});

describe("encodeUrlPath", () => {
  it("percent-encodes slashes and spaces", () => {
    expect(encodeUrlPath("a/b c")).toBe("a%2Fb%20c");
  });

  it("returns empty for null", () => {
    expect(encodeUrlPath(null)).toBe("");
  });
});

describe("safe / isSafe", () => {
  it("safe() wraps a string in a SafeString", () => {
    const s = safe("<x/>");
    expect(s).toBeInstanceOf(SafeString);
    expect(`${s}`).toBe("<x/>");
  });

  it("isSafe() returns true only for SafeString", () => {
    expect(isSafe(safe("x"))).toBe(true);
    expect(isSafe("x")).toBe(false);
    expect(isSafe(null)).toBe(false);
  });
});
