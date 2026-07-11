export type ReviewCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type ReportingWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type ReportSectionRow = {
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

export type ReportCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type ReportVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type ReportActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type ReportingCommandCenterData = {
  executive: ReviewCommandKpi[];
  reviewSummary: ReviewCommandKpi[];
  reviewMetrics: ReviewCommandKpi[];
  workflowSteps: ReportingWorkflowStep[];
  currentWorkflowStep: string;
  moduleBuckets: ReviewModuleBucket[];
  statusBuckets: ReviewStatusBucket[];
  reviewQueue: ReportSectionRow[];
  returnedItems: ReportSectionRow[];
  resolvedItems: ReportSectionRow[];
  completionComments: ReportCommentRow[];
  comments: ReportCommentRow[];
  versions: ReportVersionRow[];
  versionTimeline: ReportVersionRow[];
  recentChanges: ReportActivityRow[];
  activityFeed: ReportActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  summaryNotes: string | null;
};
