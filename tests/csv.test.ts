import { csv } from "../src/index";

describe("csv tag", () => {
  it("quotes fields containing commas", () => {
    expect(csv`${"a,b"},${"c"}`).toBe('"a,b",c');
  });

  it("quotes fields containing newlines", () => {
    expect(csv`${"line1\nline2"}`).toBe('"line1\nline2"');
  });

  it("doubles embedded quotes", () => {
    expect(csv`${'say "hi"'}`).toBe('"say ""hi"""');
  });

  it("leaves simple fields untouched", () => {
    expect(csv`${"plain"},${"text"}`).toBe("plain,text");
  });

  it("treats arrays as comma-separated lists", () => {
    expect(csv`${["a", "b", "c,d"]}`).toBe('a,b,"c,d"');
  });

  it("renders numbers and booleans", () => {
    expect(csv`${1},${true}`).toBe("1,true");
  });

  it("treats null and undefined as empty fields", () => {
    expect(csv`${null},${undefined}`).toBe(",");
  });

  it("quotes carriage-return-only payloads", () => {
    expect(csv`${"a\rb"}`).toBe('"a\rb"');
  });
});
