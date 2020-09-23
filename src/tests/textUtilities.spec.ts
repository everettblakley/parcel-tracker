import * as textUtilites from "../utilities/textUtilities";

describe("To Sentence Case", () => {
  test("returns empty string for falsy", () => {
    let text = "";
    text = textUtilites.toSentenceCase(text);
    expect(text).toBe("");
  });

  test("works for single words", () => {
    let text = "test";
    text = textUtilites.toSentenceCase(text);
    expect(text).toBe("Test");
  });

  test("works for multiple words", () => {
    let text = "this is a test";
    text = textUtilites.toSentenceCase(text);
    expect(text).toBe("This Is A Test");
  });

  test("can handle special characters", () => {
    let text = "test!test";
    text = textUtilites.toSentenceCase(text);
    expect(text).toBe("Test!test");
  });
});