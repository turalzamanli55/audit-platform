import type {
  FinancialStatementCommentType,
  FinancialStatementSectionStatus,
  FinancialStatementSectionType,
  FinancialStatementPackageStatus,
} from "@/types/financial-statements";

export type FinancialStatementSectionView = {
  id: string;
  sectionType: FinancialStatementSectionType;
  sectionStatus: FinancialStatementSectionStatus;
  title: string;
  description: string | null;
  severity: string | null;
  priority: string | null;
  dueDate: string | null;
  href: string | null;
  assignedReviewerId: string | null;
  returnNotes: string | null;
  resolvedAt: string | null;
  sortOrder: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type FinancialStatementCommentAttachmentView = {
  name: string;
  type?: string;
  size?: number;
  url?: string;
};

export type FinancialStatementCommentView = {
  id: string;
  commentType: FinancialStatementCommentType;
  body: string;
  parentCommentId: string | null;
  financialStatementSectionId: string | null;
  mentions: string[];
  attachments: FinancialStatementCommentAttachmentView[];
  resolvedAt: string | null;
  createdBy: string | null;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FinancialStatementVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  snapshot: Record<string, unknown> | null;
  isLatest: boolean;
  createdAt: string;
};

export type FinancialStatementsWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  opinionPackageId: string | null;
  packageStatus: FinancialStatementPackageStatus;
  packageVersion: number;
  progressPct: number;
  pendingCount: number;
  returnedCount: number;
  resolvedCount: number;
  pendingSectionsCount: number;
  summaryNotes: string | null;
  items: FinancialStatementSectionView[];
  comments: FinancialStatementCommentView[];
  reviewerNotes: FinancialStatementCommentView[];
  financialStatementComments: FinancialStatementCommentView[];
  internalComments: FinancialStatementCommentView[];
  versions: FinancialStatementVersionView[];
  pendingReviewCount: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  submittedAt: string | null;
  returnedAt: string | null;
  returnNotes: string | null;
  approvedAt: string | null;
  preparedAt: string | null;
  publishedAt: string | null;
  mappingCoveragePct: number;
  balanceCheckStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type FinancialStatementsWorkspaceLoadResult =
  | {
      ok: true;
      financialStatements: FinancialStatementsWorkspaceView | null;
      engagementSlug: string;
      prerequisitesMet: boolean;
      opinionApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type FinancialStatementsWorkspaceSection =
  | "overview"
  | "balance-sheet"
  | "income-statement"
  | "cash-flow-statement"
  | "changes-in-equity"
  | "notes-links"
  | "cross-references"
  | "comments"
  | "history"
  | "versions"
  | "settings";

export type FinancialStatementActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  actorId: string | null;
  sectionType: string | null;
  packageVersion: number | null;
};

export type FinancialStatementActivityView = {
  entries: FinancialStatementActivityEntryView[];
};

export type {
  FinancialStatementCommentType,
  FinancialStatementSectionStatus,
  FinancialStatementSectionType,
  FinancialStatementPackageStatus,
};
