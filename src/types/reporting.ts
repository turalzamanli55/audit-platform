import type {
  REPORT_COMMENT_TYPES,
  REPORT_SECTION_STATUSES,
  REPORT_SECTION_TYPES,
  REPORTING_PACKAGE_STATUSES,
} from "@/constants/reporting";

export type ReportingPackageStatus = (typeof REPORTING_PACKAGE_STATUSES)[number];
export type ReportSectionStatus = (typeof REPORT_SECTION_STATUSES)[number];
export type ReportSectionType = (typeof REPORT_SECTION_TYPES)[number];
export type ReportCommentType = (typeof REPORT_COMMENT_TYPES)[number];

export type SeedReportSectionCandidate = {
  sectionType: ReportSectionType;
  title: string;
  description: string | null;
  sortOrder: number;
  severity?: string | null;
  href?: string | null;
};
