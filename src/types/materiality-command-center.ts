export type MaterialityCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type MaterialityWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type MaterialityBenchmarkRow = {
  id: string;
  label: string;
  amount: string;
  percentage: string;
  calculated: string;
  isSelected: boolean;
  rank: number;
  href: string;
};

export type MaterialityCalculationRow = {
  id: string;
  type: string;
  input: string;
  percentage: string;
  result: string;
  method: string;
  isManualOverride: boolean;
  time: string;
  href: string;
};

export type MaterialityVersionRow = {
  id: string;
  versionNumber: number;
  summary: string;
  time: string;
  href: string;
};

export type MaterialityCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type MaterialityActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type MaterialityThresholdCard = {
  id: string;
  label: string;
  value: string;
  hint: string | null;
  href: string;
};

export type MaterialityCommandCenterData = {
  executive: MaterialityCommandKpi[];
  materialitySummary: MaterialityCommandKpi[];
  materialityMetrics: MaterialityCommandKpi[];
  workflowSteps: MaterialityWorkflowStep[];
  currentWorkflowStep: string;
  thresholds: MaterialityThresholdCard[];
  selectedBenchmark: {
    label: string;
    amount: string;
    percentage: string;
    calculated: string;
  } | null;
  calculationMethod: string;
  benchmarkRanking: MaterialityBenchmarkRow[];
  calculations: MaterialityCalculationRow[];
  calculationFlow: MaterialityCalculationRow[];
  versions: MaterialityVersionRow[];
  versionTimeline: MaterialityVersionRow[];
  reviewComments: MaterialityCommentRow[];
  comments: MaterialityCommentRow[];
  recentChanges: MaterialityActivityRow[];
  activityFeed: MaterialityActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  lastUpdated: string | null;
  assignedReviewer: string | null;
  specificMaterialitySummary: string;
};
