import type {
  FINANCIAL_STATEMENT_COMMENT_TYPES,
  FINANCIAL_STATEMENT_SECTION_STATUSES,
  FINANCIAL_STATEMENT_SECTION_TYPES,
  FINANCIAL_STATEMENT_PACKAGE_STATUSES,
} from "@/constants/financial-statements";

export type FinancialStatementPackageStatus =
  (typeof FINANCIAL_STATEMENT_PACKAGE_STATUSES)[number];
export type FinancialStatementSectionStatus =
  (typeof FINANCIAL_STATEMENT_SECTION_STATUSES)[number];
export type FinancialStatementSectionType =
  (typeof FINANCIAL_STATEMENT_SECTION_TYPES)[number];
export type FinancialStatementCommentType =
  (typeof FINANCIAL_STATEMENT_COMMENT_TYPES)[number];

export type SeedFinancialStatementSectionCandidate = {
  sectionType: FinancialStatementSectionType;
  title: string;
  description: string | null;
  sortOrder: number;
  severity?: string | null;
  href?: string | null;
};
