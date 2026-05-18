import { urlPath } from "../src/index";

describe("urlPath tag", () => {
  it("percent-encodes special characters in interpolations", () => {
    const id = "a/b c";
    expect(urlPath`/users/${id}`).toBe("/users/a%2Fb%20c");
  });

  it("leaves literal slashes alone", () => {
    expect(urlPath`/x/${"y"}/z`).toBe("/x/y/z");
  });

  it("encodes unicode correctly", () => {
    expect(urlPath`/q/${"café"}`).toBe("/q/caf%C3%A9");
  });

  it("treats null and undefined as empty", () => {
    expect(urlPath`/x/${null}/y`).toBe("/x//y");
    expect(urlPath`/x/${undefined}/y`).toBe("/x//y");
  });

  it("handles empty templates", () => {
    expect(urlPath``).toBe("");
  });
});
