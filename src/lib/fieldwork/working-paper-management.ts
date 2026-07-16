import { ValidationError } from "@/lib/errors";
import type { Tables } from "@/types/supabase";

/**
 * Working paper management rules (PROJECT_BIBLE §13.2 Audit).
 * Working papers are versioned; sign-offs follow the review chain
 * preparer → reviewer → partner and apply to a specific version.
 */

export const WORKING_PAPER_SIGN_OFF_ROLES = ["preparer", "reviewer", "partner"] as const;
export type WorkingPaperSignOffRole = (typeof WORKING_PAPER_SIGN_OFF_ROLES)[number];

type WorkingPaper = Tables<"working_papers">;

/** Archived papers are frozen — no new versions or sign-offs. */
export function canSnapshotWorkingPaper(paper: Pick<WorkingPaper, "paper_status">): boolean {
  return paper.paper_status !== "archived";
}

export function assertWorkingPaperSnapshotAllowed(
  paper: Pick<WorkingPaper, "paper_status">,
): void {
  if (!canSnapshotWorkingPaper(paper)) {
    throw new ValidationError("Archived working papers cannot receive new versions");
  }
}

export function nextWorkingPaperVersionNumber(existingVersionNumbers: number[]): number {
  if (existingVersionNumbers.length === 0) {
    return 1;
  }
  return Math.max(...existingVersionNumbers) + 1;
}

export function isWorkingPaperSignOffRole(value: string): value is WorkingPaperSignOffRole {
  return (WORKING_PAPER_SIGN_OFF_ROLES as readonly string[]).includes(value);
}

/**
 * Sign-off chain enforcement: reviewer sign-off requires preparer,
 * partner sign-off requires reviewer, and a role signs a version once.
 */
export function assertWorkingPaperSignOffOrder(
  existingRoles: WorkingPaperSignOffRole[],
  newRole: WorkingPaperSignOffRole,
): void {
  if (existingRoles.includes(newRole)) {
    throw new ValidationError(`This version already has a ${newRole} sign-off`);
  }
  if (newRole === "reviewer" && !existingRoles.includes("preparer")) {
    throw new ValidationError("Reviewer sign-off requires a preparer sign-off first");
  }
  if (newRole === "partner" && !existingRoles.includes("reviewer")) {
    throw new ValidationError("Partner sign-off requires a reviewer sign-off first");
  }
}
