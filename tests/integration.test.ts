import { csv, dedent, html, oneline, regex, sql, urlPath } from "../src/index";

describe("integration: tags composed in realistic patterns", () => {
  it("html composes nested fragments without double-escape", () => {
    const items = ["a", "b<c>"];
    const list = html`
      <ul>${items.map((item) => html`<li>${item}</li>`)}</ul>
    `;
    expect(list.value).toContain("<li>a</li>");
    expect(list.value).toContain("<li>b&lt;c&gt;</li>");
  });

  it("sql + urlPath produce paired query and URL", () => {
    const userId = "alice/bob";
    const url = urlPath`/users/${userId}`;
    const query = sql`SELECT * FROM users WHERE id = ${userId}`;
    expect(url).toBe("/users/alice%2Fbob");
    expect(query.text).toBe("SELECT * FROM users WHERE id = $1");
    expect(query.values).toEqual([userId]);
  });

  it("regex + escapeRegex protect against user-supplied patterns", () => {
    const userPattern = "a.b";
    const re = regex("i")`^${userPattern}$`;
    expect(re.test("a.b")).toBe(true);
    expect(re.test("aXb")).toBe(false);
  });

  it("dedent + oneline are independent", () => {
    const a = dedent`
      first
        second
    `;
    const b = oneline`
      first
        second
    `;
    expect(a).toBe("first\n  second");
    expect(b).toBe("first second");
  });

  it("csv handles a table-row-like template", () => {
    const row = csv`${"id"},${"name"},${"note"}`;
    expect(row).toBe("id,name,note");
    const userRow = csv`${1},${"Alice"},${"loves, commas"}`;
    expect(userRow).toBe('1,Alice,"loves, commas"');
  });
});
