import { ValidationError } from "@/lib/errors";

/** IFRS classification rules (PROJECT_BIBLE — IFRS Classification). */
export type IfrsClassificationInput = {
  accountCode: string;
  accountName: string;
  ifrsClass?: string | null;
};

export function assertIfrsClassificationInput(input: IfrsClassificationInput): void {
  if (!input.accountCode.trim()) {
    throw new ValidationError("Account code is required for IFRS classification");
  }
  if (!input.accountName.trim()) {
    throw new ValidationError("Account name is required for IFRS classification");
  }
}

export function classifyIfrsAccount(input: IfrsClassificationInput): string {
  assertIfrsClassificationInput(input);
  if (input.ifrsClass?.trim()) return input.ifrsClass.trim();
  const code = input.accountCode.trim();
  if (code.startsWith("1")) return "asset";
  if (code.startsWith("2")) return "liability";
  if (code.startsWith("3")) return "equity";
  if (code.startsWith("4")) return "income";
  if (code.startsWith("5") || code.startsWith("6")) return "expense";
  return "other";
}

/** IFRS disclosure drafting workflow. */
export const IFRS_DISCLOSURE_DRAFTING_STATUSES = [
  "draft",
  "in_review",
  "approved",
  "published",
] as const;

export type IfrsDisclosureDraftingStatus =
  (typeof IFRS_DISCLOSURE_DRAFTING_STATUSES)[number];

const DISCLOSURE_TRANSITIONS: Record<
  IfrsDisclosureDraftingStatus,
  IfrsDisclosureDraftingStatus[]
> = {
  draft: ["in_review"],
  in_review: ["approved", "draft"],
  approved: ["published", "in_review"],
  published: [],
};

export function assertIfrsDisclosureDraftingTransition(
  from: IfrsDisclosureDraftingStatus,
  to: IfrsDisclosureDraftingStatus,
): void {
  if (!(DISCLOSURE_TRANSITIONS[from] ?? []).includes(to)) {
    throw new ValidationError(`Invalid IFRS disclosure drafting transition "${from}" → "${to}"`);
  }
}

export class IfrsDisclosureDraftingWorkflowEngine {
  nextStatuses(from: IfrsDisclosureDraftingStatus): IfrsDisclosureDraftingStatus[] {
    return DISCLOSURE_TRANSITIONS[from] ?? [];
  }

  assertTransition(from: IfrsDisclosureDraftingStatus, to: IfrsDisclosureDraftingStatus): void {
    assertIfrsDisclosureDraftingTransition(from, to);
  }
}

/** IFRS note management + versioning. */
export type IfrsNoteManagementPackage = {
  packageId: string;
  packageVersion: number;
  mappingSetId?: string | null;
  presentationId?: string | null;
  noteCount: number;
};

export function assertIfrsNoteManagementPackage(pkg: IfrsNoteManagementPackage): void {
  if (!pkg.packageId.trim()) {
    throw new ValidationError("IFRS note package is required");
  }
  if (pkg.packageVersion < 1) {
    throw new ValidationError("IFRS note package version must be >= 1");
  }
  if (pkg.noteCount < 0) {
    throw new ValidationError("Note count cannot be negative");
  }
}

export function nextIfrsNoteManagementVersion(currentVersion: number): number {
  if (currentVersion < 1) {
    throw new ValidationError("Current IFRS note version must be >= 1");
  }
  return currentVersion + 1;
}
