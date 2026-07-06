export type ReviewCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type CompletionWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type CompletionItemRow = {
  id: string;
  title: string;
  itemType: string;
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

export type CompletionCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type CompletionVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type CompletionActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type CompletionCommandCenterData = {
  executive: ReviewCommandKpi[];
  reviewSummary: ReviewCommandKpi[];
  reviewMetrics: ReviewCommandKpi[];
  workflowSteps: CompletionWorkflowStep[];
  currentWorkflowStep: string;
  moduleBuckets: ReviewModuleBucket[];
  statusBuckets: ReviewStatusBucket[];
  reviewQueue: CompletionItemRow[];
  returnedItems: CompletionItemRow[];
  resolvedItems: CompletionItemRow[];
  completionComments: CompletionCommentRow[];
  comments: CompletionCommentRow[];
  versions: CompletionVersionRow[];
  versionTimeline: CompletionVersionRow[];
  recentChanges: CompletionActivityRow[];
  activityFeed: CompletionActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  summaryNotes: string | null;
};
