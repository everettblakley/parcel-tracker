import * as utilities from "../src/utilities";

describe("toSentenceCase", () => {
  it("works on a single word", () => {
    let text = "test";
    text = utilities.toSentenceCase(text);
    expect(text).toEqual("Test");
  });
});