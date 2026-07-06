import type {
  CompletionCommentType,
  CompletionItemStatus,
  CompletionItemType,
  CompletionPackageStatus,
} from "@/types/completion";

export type CompletionItemView = {
  id: string;
  itemType: CompletionItemType;
  itemStatus: CompletionItemStatus;
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

export type CompletionCommentAttachmentView = {
  name: string;
  type?: string;
  size?: number;
  url?: string;
};

export type CompletionCommentView = {
  id: string;
  commentType: CompletionCommentType;
  body: string;
  parentCommentId: string | null;
  completionItemId: string | null;
  mentions: string[];
  attachments: CompletionCommentAttachmentView[];
  resolvedAt: string | null;
  createdBy: string | null;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CompletionVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  snapshot: Record<string, unknown> | null;
  isLatest: boolean;
  createdAt: string;
};

export type CompletionWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  reviewPackageId: string | null;
  packageStatus: CompletionPackageStatus;
  packageVersion: number;
  progressPct: number;
  pendingCount: number;
  returnedCount: number;
  resolvedCount: number;
  outstandingCount: number;
  summaryNotes: string | null;
  items: CompletionItemView[];
  comments: CompletionCommentView[];
  reviewerNotes: CompletionCommentView[];
  completionComments: CompletionCommentView[];
  internalComments: CompletionCommentView[];
  versions: CompletionVersionView[];
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

export type CompletionWorkspaceLoadResult =
  | {
      ok: true;
      completion: CompletionWorkspaceView | null;
      engagementSlug: string;
      prerequisitesMet: boolean;
      reviewApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type CompletionWorkspaceSection =
  | "overview"
  | "checklist"
  | "outstanding-items"
  | "management-letter"
  | "subsequent-events"
  | "going-concern"
  | "representation-letter"
  | "final-analytics"
  | "comments"
  | "history"
  | "versions"
  | "settings";

export type CompletionActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  actorId: string | null;
  itemType: string | null;
  packageVersion: number | null;
};

export type CompletionActivityView = {
  entries: CompletionActivityEntryView[];
};

export type {
  CompletionCommentType,
  CompletionItemStatus,
  CompletionItemType,
  CompletionPackageStatus,
};
