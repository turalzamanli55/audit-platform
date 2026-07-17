import { describe, expect, it } from "vitest";
import {
  assertIfrsNoteManagementPackage,
  nextIfrsNoteManagementVersion,
} from "./ifrs-note-management";
import { describeIfrsNoteManagementVersioning } from "./ifrs-note-management-versioning";

describe("ifrs-note-management", () => {
  it("validates packages and versions notes", () => {
    expect(() =>
      assertIfrsNoteManagementPackage({
        packageId: "pkg-1",
        packageVersion: 1,
        noteCount: 3,
      }),
    ).not.toThrow();
    expect(nextIfrsNoteManagementVersion(2)).toBe(3);
    expect(describeIfrsNoteManagementVersioning(3)).toContain("version 3");
  });
});
