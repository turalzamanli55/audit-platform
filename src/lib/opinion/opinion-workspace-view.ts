import type {
  OpinionCommentType,
  OpinionSectionStatus,
  OpinionSectionType,
  OpinionPackageStatus,
} from "@/types/opinion";

export type OpinionSectionView = {
  id: string;
  sectionType: OpinionSectionType;
  sectionStatus: OpinionSectionStatus;
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

export type OpinionCommentAttachmentView = {
  name: string;
  type?: string;
  size?: number;
  url?: string;
};

export type OpinionCommentView = {
  id: string;
  commentType: OpinionCommentType;
  body: string;
  parentCommentId: string | null;
  opinionSectionId: string | null;
  mentions: string[];
  attachments: OpinionCommentAttachmentView[];
  resolvedAt: string | null;
  createdBy: string | null;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OpinionVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  snapshot: Record<string, unknown> | null;
  isLatest: boolean;
  createdAt: string;
};

export type OpinionWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  reportingPackageId: string | null;
  packageStatus: OpinionPackageStatus;
  packageVersion: number;
  progressPct: number;
  pendingCount: number;
  returnedCount: number;
  resolvedCount: number;
  pendingSectionsCount: number;
  summaryNotes: string | null;
  items: OpinionSectionView[];
  comments: OpinionCommentView[];
  reviewerNotes: OpinionCommentView[];
  opinionComments: OpinionCommentView[];
  internalComments: OpinionCommentView[];
  versions: OpinionVersionView[];
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

export type OpinionWorkspaceLoadResult =
  | {
      ok: true;
      opinion: OpinionWorkspaceView | null;
      engagementSlug: string;
      prerequisitesMet: boolean;
      reportingApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type OpinionWorkspaceSection =
  | "overview"
  | "opinion-type"
  | "basis-for-opinion"
  | "key-audit-matters"
  | "emphasis-of-matter"
  | "other-information"
  | "responsibilities"
  | "signature"
  | "comments"
  | "history"
  | "versions"
  | "settings";

export type OpinionActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  actorId: string | null;
  sectionType: string | null;
  packageVersion: number | null;
};

export type OpinionActivityView = {
  entries: OpinionActivityEntryView[];
};

export type {
  OpinionCommentType,
  OpinionSectionStatus,
  OpinionSectionType,
  OpinionPackageStatus,
};
