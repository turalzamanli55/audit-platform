import type {
  ReportCommentType,
  ReportSectionStatus,
  ReportSectionType,
  ReportingPackageStatus,
} from "@/types/reporting";

export type ReportSectionView = {
  id: string;
  sectionType: ReportSectionType;
  sectionStatus: ReportSectionStatus;
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

export type ReportCommentAttachmentView = {
  name: string;
  type?: string;
  size?: number;
  url?: string;
};

export type ReportCommentView = {
  id: string;
  commentType: ReportCommentType;
  body: string;
  parentCommentId: string | null;
  reportSectionId: string | null;
  mentions: string[];
  attachments: ReportCommentAttachmentView[];
  resolvedAt: string | null;
  createdBy: string | null;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReportVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  snapshot: Record<string, unknown> | null;
  isLatest: boolean;
  createdAt: string;
};

export type ReportingWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  completionPackageId: string | null;
  packageStatus: ReportingPackageStatus;
  packageVersion: number;
  progressPct: number;
  pendingCount: number;
  returnedCount: number;
  resolvedCount: number;
  pendingSectionsCount: number;
  summaryNotes: string | null;
  items: ReportSectionView[];
  comments: ReportCommentView[];
  reviewerNotes: ReportCommentView[];
  reportingComments: ReportCommentView[];
  internalComments: ReportCommentView[];
  versions: ReportVersionView[];
  pendingReviewCount: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  submittedAt: string | null;
  returnedAt: string | null;
  returnNotes: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportingWorkspaceLoadResult =
  | {
      ok: true;
      reporting: ReportingWorkspaceView | null;
      engagementSlug: string;
      prerequisitesMet: boolean;
      completionApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type ReportingWorkspaceSection =
  | "overview"
  | "executive-summary"
  | "financial-statements"
  | "ifrs-notes"
  | "management-letter"
  | "audit-findings"
  | "recommendations"
  | "appendices"
  | "comments"
  | "history"
  | "versions"
  | "settings";

export type ReportActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  actorId: string | null;
  sectionType: string | null;
  packageVersion: number | null;
};

export type ReportActivityView = {
  entries: ReportActivityEntryView[];
};

export type {
  ReportCommentType,
  ReportSectionStatus,
  ReportSectionType,
  ReportingPackageStatus,
};
