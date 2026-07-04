export type EngagementCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type EngagementPipelinePhase = {
  id: string;
  label: string;
  statusLabel: string;
  statusVariant: "default" | "warning" | "success" | "destructive";
  progressPct: number;
  owner: string | null;
  lastUpdate: string;
  lastUpdateRelative: string;
  href: string;
  ctaLabel: string;
  isActive: boolean;
  isEmpty: boolean;
};

export type EngagementReviewQueueItem = {
  id: string;
  module: string;
  label: string;
  href: string;
};

export type EngagementIssueItem = {
  id: string;
  label: string;
  count: number;
  href: string;
  variant: "default" | "warning" | "destructive";
};

export type EngagementActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type EngagementDocumentRow = {
  id: string;
  name: string;
  documentType: string;
  time: string;
  href: string;
};

export type EngagementCommentRow = {
  id: string;
  module: string;
  body: string;
  time: string;
  href: string;
};

export type EngagementDecisionRow = {
  id: string;
  label: string;
  time: string;
  module: string;
};

export type EngagementTeamRow = {
  id: string;
  displayName: string;
  role: string;
  email: string;
};

export type EngagementClientSnapshot = {
  companyName: string;
  companySlug: string;
  engagementCode: string | null;
  reportingFramework: string;
  periodRange: string | null;
  plannedRange: string | null;
};

export type EngagementCompanyHealth = {
  statusLabel: string;
  statusVariant: "default" | "warning" | "success" | "destructive";
  framework: string;
  jurisdiction: string | null;
};

export type EngagementCommandCenterData = {
  executive: EngagementCommandKpi[];
  auditHealth: EngagementCommandKpi[];
  overallCompletionPct: number;
  pipeline: EngagementPipelinePhase[];
  reviewQueue: EngagementReviewQueueItem[];
  outstandingIssues: EngagementIssueItem[];
  auditMetrics: EngagementCommandKpi[];
  recentActivity: EngagementActivityRow[];
  recentDocuments: EngagementDocumentRow[];
  recentComments: EngagementCommentRow[];
  recentDecisions: EngagementDecisionRow[];
  auditTimeline: EngagementActivityRow[];
  upcomingDeadline: string | null;
  deadlineLabel: string | null;
  isOverdue: boolean;
  client: EngagementClientSnapshot;
  companyHealth: EngagementCompanyHealth | null;
  team: EngagementTeamRow[];
  pendingReviews: number;
  openFindings: number;
  attentionCount: number;
};
