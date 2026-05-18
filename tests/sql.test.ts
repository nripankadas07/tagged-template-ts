import { sql, TaggedTemplateError } from "../src/index";

describe("sql tag", () => {
  it("turns each interpolation into a $N placeholder", () => {
    const q = sql`SELECT * FROM users WHERE id = ${42}`;
    expect(q.text).toBe("SELECT * FROM users WHERE id = $1");
    expect(q.values).toEqual([42]);
  });

  it("numbers placeholders left to right", () => {
    const q = sql`UPDATE x SET a = ${1}, b = ${2} WHERE id = ${3}`;
    expect(q.text).toBe("UPDATE x SET a = $1, b = $2 WHERE id = $3");
    expect(q.values).toEqual([1, 2, 3]);
  });

  it("preserves NULL via untouched values array", () => {
    const q = sql`INSERT INTO x VALUES (${null}, ${undefined})`;
    expect(q.text).toBe("INSERT INTO x VALUES ($1, $2)");
    expect(q.values).toEqual([null, undefined]);
  });

  it("preserves typed values verbatim", () => {
    const arr = [1, 2, 3];
    const q = sql`SELECT ${arr}::int[]`;
    expect(q.values).toEqual([arr]);
    expect(q.values[0]).toBe(arr);
  });

  it("handles empty template literal", () => {
    const q = sql``;
    expect(q.text).toBe("");
    expect(q.values).toEqual([]);
  });

  it("throws when invoked manually with mismatched arrays", () => {
    const strings = ["a", "b"] as unknown as TemplateStringsArray;
    expect(() => sql(strings, 1, 2)).toThrow(TaggedTemplateError);
  });

  it("throws when invoked with an empty strings array", () => {
    const strings = [] as unknown as TemplateStringsArray;
    expect(() => sql(strings)).toThrow(TaggedTemplateError);
  });

  it("returns a frozen-feeling read-only shape", () => {
    const q = sql`x ${1}`;
    expect(Array.isArray(q.values)).toBe(true);
    expect(q.values.length).toBe(1);
  });
});
