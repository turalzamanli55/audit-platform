import { describe, expect, it } from "vitest";
import { assertEvidenceLinkage } from "./evidence-management";

describe("evidence-management", () => {
  it("requires evidence linkage to a procedure or working paper", () => {
    expect(() =>
      assertEvidenceLinkage({ name: "Bank confirm", procedureId: "proc-1" }),
    ).not.toThrow();
    expect(() =>
      assertEvidenceLinkage({ name: "Bank confirm", workingPaperId: "wp-1" }),
    ).not.toThrow();
    expect(() => assertEvidenceLinkage({ name: "Orphan" })).toThrowError(/link/i);
    expect(() =>
      assertEvidenceLinkage({ name: "  ", procedureId: "proc-1" }),
    ).toThrowError(/name/i);
  });
});
