export type ReviewCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type FinancialStatementsWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type FinancialStatementSectionRow = {
  id: string;
  title: string;
  sectionType: string;
  sourceEntityType: string;
  sectionStatus: string;
  severity: string | null;
  assignedReviewerId: string | null;
  href: string;
};

export type ReviewModuleBucket = {
  id: string;
  label: string;
  count: number;
  href: string;
};

export type ReviewStatusBucket = {
  id: string;
  label: string;
  count: number;
  href: string;
};

export type FinancialStatementCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type FinancialStatementVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type FinancialStatementActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type FinancialStatementsCommandCenterData = {
  executive: ReviewCommandKpi[];
  reviewSummary: ReviewCommandKpi[];
  reviewMetrics: ReviewCommandKpi[];
  workflowSteps: FinancialStatementsWorkflowStep[];
  currentWorkflowStep: string;
  moduleBuckets: ReviewModuleBucket[];
  statusBuckets: ReviewStatusBucket[];
  reviewQueue: FinancialStatementSectionRow[];
  returnedItems: FinancialStatementSectionRow[];
  resolvedItems: FinancialStatementSectionRow[];
  completionComments: FinancialStatementCommentRow[];
  comments: FinancialStatementCommentRow[];
  versions: FinancialStatementVersionRow[];
  versionTimeline: FinancialStatementVersionRow[];
  recentChanges: FinancialStatementActivityRow[];
  activityFeed: FinancialStatementActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  summaryNotes: string | null;
};
