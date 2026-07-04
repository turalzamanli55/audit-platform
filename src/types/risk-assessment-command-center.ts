export type RiskCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type RiskWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type RiskHeatmapBucket = {
  rating: string | null;
  label: string;
  count: number;
  cssClass: string;
};

export type RiskMatrixPreviewCell = {
  id: string;
  accountName: string;
  assertion: string;
  rating: string | null;
  ratingLabel: string;
  isSignificant: boolean;
  href: string;
};

export type RiskCategoryRow = {
  id: string;
  name: string;
  count: number;
  href: string;
};

export type RiskRegisterRow = {
  id: string;
  title: string;
  riskType: string;
  residualRating: string | null;
  isSignificant: boolean;
  ownerId: string | null;
  href: string;
};

export type RiskResponseRow = {
  id: string;
  riskTitle: string;
  responseType: string;
  description: string;
  href: string;
};

export type RiskProcedureRow = {
  id: string;
  riskTitle: string;
  procedureReference: string;
  href: string;
};

export type RiskCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type RiskActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type RiskAssessmentCommandCenterData = {
  executive: RiskCommandKpi[];
  riskSummary: RiskCommandKpi[];
  riskMetrics: RiskCommandKpi[];
  riskKpis: RiskCommandKpi[];
  workflowSteps: RiskWorkflowStep[];
  currentWorkflowStep: string;
  heatmapBuckets: RiskHeatmapBucket[];
  matrixPreview: RiskMatrixPreviewCell[];
  categoryDistribution: RiskCategoryRow[];
  significantRisks: RiskRegisterRow[];
  openResponses: RiskRegisterRow[];
  outstandingProcedures: RiskRegisterRow[];
  responses: RiskResponseRow[];
  procedures: RiskProcedureRow[];
  reviewComments: RiskCommentRow[];
  comments: RiskCommentRow[];
  recentChanges: RiskActivityRow[];
  activityFeed: RiskActivityRow[];
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  riskHealth: string;
  riskHealthVariant: "default" | "warning" | "success" | "destructive";
  assignedOwnerCount: number;
  assertionCoveragePct: number;
  lastUpdated: string | null;
};
