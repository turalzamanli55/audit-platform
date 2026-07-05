import type {
  REVIEW_COMMENT_TYPES,
  REVIEW_ITEM_STATUSES,
  REVIEW_PACKAGE_STATUSES,
  REVIEW_SOURCE_MODULES,
} from "@/constants/review";

export type ReviewPackageStatus = (typeof REVIEW_PACKAGE_STATUSES)[number];
export type ReviewItemStatus = (typeof REVIEW_ITEM_STATUSES)[number];
export type ReviewSourceModule = (typeof REVIEW_SOURCE_MODULES)[number];
export type ReviewCommentType = (typeof REVIEW_COMMENT_TYPES)[number];

export type SyncReviewItemCandidate = {
  sourceModule: ReviewSourceModule;
  sourceEntityType: string;
  sourceEntityId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  severity?: string | null;
  href?: string | null;
};
