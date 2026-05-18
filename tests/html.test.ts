import { html, isSafe, safe } from "../src/index";

describe("html tag", () => {
  it("escapes the dangerous characters", () => {
    const xss = "<script>alert(1)</script>";
    expect(html`<p>${xss}</p>`.value).toBe(
      "<p>&lt;script&gt;alert(1)&lt;&#47;script&gt;</p>",
    );
  });

  it("returns a SafeString", () => {
    const out = html`<b>${"hi"}</b>`;
    expect(isSafe(out)).toBe(true);
    expect(`${out}`).toBe("<b>hi</b>");
  });

  it("does not double-escape nested html results", () => {
    const inner = html`<b>${"&"}</b>`;
    const outer = html`<p>${inner}</p>`;
    expect(outer.value).toBe("<p><b>&amp;</b></p>");
  });

  it("preserves explicit SafeString wrappers", () => {
    expect(html`<p>${safe("<raw/>")}</p>`.value).toBe("<p><raw/></p>");
  });

  it("treats null and undefined as empty", () => {
    expect(html`x${null}y${undefined}z`.value).toBe("xyz");
  });

  it("renders numbers and booleans", () => {
    expect(html`${1}-${true}`.value).toBe("1-true");
  });

  it("recursively escapes arrays", () => {
    expect(html`${["<", "&"]}`.value).toBe("&lt;&amp;");
  });

  it("handles empty templates", () => {
    expect(html``.value).toBe("");
  });

  it("escapes equal sign and backtick", () => {
    expect(html`${"a=b`c"}`.value).toBe("a&#61;b&#96;c");
  });

  it("escapes quote characters", () => {
    expect(html`${"\"'"}`.value).toBe("&quot;&#39;");
  });
});
