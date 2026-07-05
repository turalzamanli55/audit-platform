export type ReviewCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type ReviewWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type ReviewItemRow = {
  id: string;
  title: string;
  sourceModule: string;
  sourceEntityType: string;
  itemStatus: string;
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

export type ReviewCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type ReviewVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type ReviewActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type ReviewCommandCenterData = {
  executive: ReviewCommandKpi[];
  reviewSummary: ReviewCommandKpi[];
  reviewMetrics: ReviewCommandKpi[];
  workflowSteps: ReviewWorkflowStep[];
  currentWorkflowStep: string;
  moduleBuckets: ReviewModuleBucket[];
  statusBuckets: ReviewStatusBucket[];
  reviewQueue: ReviewItemRow[];
  returnedItems: ReviewItemRow[];
  resolvedItems: ReviewItemRow[];
  reviewComments: ReviewCommentRow[];
  comments: ReviewCommentRow[];
  versions: ReviewVersionRow[];
  versionTimeline: ReviewVersionRow[];
  recentChanges: ReviewActivityRow[];
  activityFeed: ReviewActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  summaryNotes: string | null;
};
