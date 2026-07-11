import type {
  OPINION_COMMENT_TYPES,
  OPINION_SECTION_STATUSES,
  OPINION_SECTION_TYPES,
  OPINION_PACKAGE_STATUSES,
} from "@/constants/opinion";

export type OpinionPackageStatus = (typeof OPINION_PACKAGE_STATUSES)[number];
export type OpinionSectionStatus = (typeof OPINION_SECTION_STATUSES)[number];
export type OpinionSectionType = (typeof OPINION_SECTION_TYPES)[number];
export type OpinionCommentType = (typeof OPINION_COMMENT_TYPES)[number];

export type SeedOpinionSectionCandidate = {
  sectionType: OpinionSectionType;
  title: string;
  description: string | null;
  sortOrder: number;
  severity?: string | null;
  href?: string | null;
};
