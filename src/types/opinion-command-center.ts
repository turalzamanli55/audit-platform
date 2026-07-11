export type ReviewCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type OpinionWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type OpinionSectionRow = {
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

export type OpinionCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type OpinionVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type OpinionActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type OpinionCommandCenterData = {
  executive: ReviewCommandKpi[];
  reviewSummary: ReviewCommandKpi[];
  reviewMetrics: ReviewCommandKpi[];
  workflowSteps: OpinionWorkflowStep[];
  currentWorkflowStep: string;
  moduleBuckets: ReviewModuleBucket[];
  statusBuckets: ReviewStatusBucket[];
  reviewQueue: OpinionSectionRow[];
  returnedItems: OpinionSectionRow[];
  resolvedItems: OpinionSectionRow[];
  completionComments: OpinionCommentRow[];
  comments: OpinionCommentRow[];
  versions: OpinionVersionRow[];
  versionTimeline: OpinionVersionRow[];
  recentChanges: OpinionActivityRow[];
  activityFeed: OpinionActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  summaryNotes: string | null;
};
