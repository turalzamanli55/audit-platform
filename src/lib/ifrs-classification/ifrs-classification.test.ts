import { describe, expect, it } from "vitest";
import { assertIfrsClassificationInput, classifyIfrsAccount } from "./ifrs-classification";

describe("ifrs-classification", () => {
  it("classifies accounts and validates inputs", () => {
    expect(classifyIfrsAccount({ accountCode: "1200", accountName: "Cash" })).toBe("asset");
    expect(
      classifyIfrsAccount({ accountCode: "4000", accountName: "Revenue", ifrsClass: "income" }),
    ).toBe("income");
    expect(() =>
      assertIfrsClassificationInput({ accountCode: "", accountName: "Cash" }),
    ).toThrowError(/Account code/);
  });
});
