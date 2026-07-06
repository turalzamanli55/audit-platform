import type {
  COMPLETION_COMMENT_TYPES,
  COMPLETION_ITEM_STATUSES,
  COMPLETION_ITEM_TYPES,
  COMPLETION_PACKAGE_STATUSES,
} from "@/constants/completion";

export type CompletionPackageStatus = (typeof COMPLETION_PACKAGE_STATUSES)[number];
export type CompletionItemStatus = (typeof COMPLETION_ITEM_STATUSES)[number];
export type CompletionItemType = (typeof COMPLETION_ITEM_TYPES)[number];
export type CompletionCommentType = (typeof COMPLETION_COMMENT_TYPES)[number];

export type SeedCompletionItemCandidate = {
  itemType: CompletionItemType;
  title: string;
  description: string | null;
  sortOrder: number;
  severity?: string | null;
  href?: string | null;
};
