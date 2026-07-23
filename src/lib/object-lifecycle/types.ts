/**
 * Stateless Object Lifecycle Registry — orchestration only.
 * No persistence. Reuses deleted_at, audit_logs, legal_hold policies, export requests.
 */

export const PLATFORM_DEFAULT_RETENTION_DAYS = 1825; // 5 years

export const DELETE_REASON_CODES = [
  "duplicate",
  "mistaken_entry",
  "merged",
  "client_request",
  "test_data",
  "compliance_request",
  "other",
] as const;

export type DeleteReasonCode = (typeof DELETE_REASON_CODES)[number];

export type LifecycleObjectType =
  | "organization"
  | "company"
  | "engagement"
  | "workspace"
  | "membership"
  | "working_paper"
  | "risk_assessment"
  | "financial_statement"
  | "document"
  | "report"
  | "template"
  | "folder"
  | "evidence"
  | "comment"
  | "task";

export type RestoreMode = "only" | "with_children" | "hierarchy";

export type SoftDeletedRecord = {
  objectType: LifecycleObjectType;
  id: string;
  name: string;
  organizationId: string | null;
  workspaceId: string | null;
  parentType: LifecycleObjectType | null;
  parentId: string | null;
  deletedAt: string;
  deletedBy: string | null;
  status: string | null;
  version: number | null;
};

export type DeleteReasonInput = {
  code: DeleteReasonCode;
  customText?: string | null;
};

export type RetentionResolution = {
  retentionDays: number;
  source: "organization" | "platform_default";
  deletedAt: string;
  retentionUntil: string;
  remainingMs: number;
  remainingDays: number;
  eligibleForPermanentDelete: boolean;
};

export type DependencySummary = {
  engagements: number;
  users: number;
  workspaces: number;
  companies: number;
  workingPapers: number;
  reports: number;
  documents: number;
  evidence: number;
  children: Array<{ objectType: LifecycleObjectType; id: string; name: string }>;
};

export type RestorePreview = {
  root: SoftDeletedRecord;
  mode: RestoreMode;
  objectsToRestore: SoftDeletedRecord[];
  dependencies: DependencySummary;
};

export type LegalHoldState = {
  enabled: boolean;
  policyId: string | null;
  reason: string | null;
  enabledBy: string | null;
  enabledAt: string | null;
};

/** Build policy_code for per-object legal hold on existing policies table. */
export function objectLegalHoldPolicyCode(
  objectType: LifecycleObjectType,
  objectId: string,
): string {
  return `object:${objectType}:${objectId}`;
}
