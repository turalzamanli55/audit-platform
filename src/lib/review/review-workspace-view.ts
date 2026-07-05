import type {
  ReviewCommentType,
  ReviewItemStatus,
  ReviewPackageStatus,
  ReviewSourceModule,
} from "@/types/review";

export type ReviewItemView = {
  id: string;
  sourceModule: ReviewSourceModule;
  sourceEntityType: string;
  sourceEntityId: string;
  itemStatus: ReviewItemStatus;
  title: string;
  description: string | null;
  severity: string | null;
  href: string | null;
  assignedReviewerId: string | null;
  returnNotes: string | null;
  resolvedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewCommentView = {
  id: string;
  commentType: ReviewCommentType;
  body: string;
  createdAt: string;
};

export type ReviewVersionView = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  createdAt: string;
};

export type ReviewWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  fieldworkPackageId: string | null;
  packageStatus: ReviewPackageStatus;
  packageVersion: number;
  progressPct: number;
  pendingCount: number;
  returnedCount: number;
  resolvedCount: number;
  openFindingsCount: number;
  summaryNotes: string | null;
  items: ReviewItemView[];
  comments: ReviewCommentView[];
  reviewerNotes: ReviewCommentView[];
  reviewComments: ReviewCommentView[];
  internalComments: ReviewCommentView[];
  versions: ReviewVersionView[];
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

export type ReviewWorkspaceLoadResult =
  | {
      ok: true;
      review: ReviewWorkspaceView | null;
      engagementSlug: string;
      fieldworkStarted: boolean;
      fieldworkSubstantiallyComplete: boolean;
      reviewApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type ReviewWorkspaceSection =
  | "overview"
  | "review-queue"
  | "open-findings"
  | "pending-reviews"
  | "resolved-reviews"
  | "reviewer-notes"
  | "comments"
  | "history"
  | "versions"
  | "settings";

export type ReviewActivityEntryView = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  actorName: string | null;
  packageVersion: number | null;
};

export type ReviewActivityView = {
  entries: ReviewActivityEntryView[];
};

export type { ReviewCommentType, ReviewItemStatus, ReviewPackageStatus, ReviewSourceModule };
