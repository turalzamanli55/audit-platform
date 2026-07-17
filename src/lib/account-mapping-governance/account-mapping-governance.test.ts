import { describe, expect, it } from "vitest";
import { assertAccountMappingGovernanceEntry } from "./account-mapping-governance-validation";

describe("account-mapping-governance", () => {
  it("requires account and FS line codes", () => {
    expect(() =>
      assertAccountMappingGovernanceEntry({ accountCode: "1000", fsLineCode: "cash" }),
    ).not.toThrow();
    expect(() =>
      assertAccountMappingGovernanceEntry({ accountCode: "", fsLineCode: "cash" }),
    ).toThrowError(/requires/);
  });
});
