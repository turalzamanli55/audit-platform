import { describe, expect, it } from "vitest";
import {
  WORKING_PAPER_SIGN_OFF_ROLES,
  assertWorkingPaperSignOffOrder,
  assertWorkingPaperSnapshotAllowed,
  canSnapshotWorkingPaper,
  isWorkingPaperSignOffRole,
  nextWorkingPaperVersionNumber,
} from "./working-paper-management";

const activePaper = { paper_status: "in_progress" as const };

describe("working paper management rules", () => {
  it("allows snapshots for non-archived papers", () => {
    expect(canSnapshotWorkingPaper(activePaper)).toBe(true);
    expect(() => assertWorkingPaperSnapshotAllowed(activePaper)).not.toThrow();
  });

  it("freezes archived papers", () => {
    const archived = { paper_status: "archived" as const };
    expect(canSnapshotWorkingPaper(archived)).toBe(false);
    expect(() => assertWorkingPaperSnapshotAllowed(archived)).toThrowError(/Archived/);
  });

  it("computes monotonically increasing version numbers", () => {
    expect(nextWorkingPaperVersionNumber([])).toBe(1);
    expect(nextWorkingPaperVersionNumber([1])).toBe(2);
    expect(nextWorkingPaperVersionNumber([3, 1, 2])).toBe(4);
  });

  it("recognizes valid sign-off roles", () => {
    for (const role of WORKING_PAPER_SIGN_OFF_ROLES) {
      expect(isWorkingPaperSignOffRole(role)).toBe(true);
    }
    expect(isWorkingPaperSignOffRole("intern")).toBe(false);
  });

  it("enforces preparer → reviewer → partner sign-off order", () => {
    expect(() => assertWorkingPaperSignOffOrder([], "preparer")).not.toThrow();
    expect(() => assertWorkingPaperSignOffOrder([], "reviewer")).toThrowError(/preparer/);
    expect(() => assertWorkingPaperSignOffOrder(["preparer"], "reviewer")).not.toThrow();
    expect(() => assertWorkingPaperSignOffOrder(["preparer"], "partner")).toThrowError(
      /reviewer/,
    );
    expect(() =>
      assertWorkingPaperSignOffOrder(["preparer", "reviewer"], "partner"),
    ).not.toThrow();
  });

  it("rejects duplicate sign-offs for the same version", () => {
    expect(() => assertWorkingPaperSignOffOrder(["preparer"], "preparer")).toThrowError(
      /already/,
    );
  });
});
