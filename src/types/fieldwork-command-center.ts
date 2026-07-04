export type FieldworkCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type FieldworkWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type FieldworkProcedureRow = {
  id: string;
  title: string;
  status: string;
  completionPct: number;
  assignedAuditorId: string | null;
  dueDate: string | null;
  href: string;
};

export type FieldworkWorkingPaperRow = {
  id: string;
  title: string;
  referenceCode: string | null;
  status: string;
  procedureTitle: string;
  tickmarkCount: number;
  href: string;
};

export type FieldworkEvidenceRow = {
  id: string;
  name: string;
  status: string;
  documentType: string;
  time: string;
  href: string;
};

export type FieldworkFindingRow = {
  id: string;
  title: string;
  severity: string;
  status: string;
  time: string;
  href: string;
};

export type FieldworkCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
  href: string;
};

export type FieldworkActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type FieldworkSeverityBucket = {
  severity: string;
  count: number;
};

export type FieldworkStatusBucket = {
  id: string;
  label: string;
  count: number;
  href: string;
};

export type FieldworkTimelineRow = {
  id: string;
  label: string;
  date: string | null;
  href: string;
};

export type FieldworkCommandCenterData = {
  executive: FieldworkCommandKpi[];
  executionProgress: FieldworkCommandKpi[];
  fieldworkKpis: FieldworkCommandKpi[];
  workflowSteps: FieldworkWorkflowStep[];
  currentWorkflowStep: string;
  procedureStatusBuckets: FieldworkStatusBucket[];
  workingPaperStatusBuckets: FieldworkStatusBucket[];
  evidenceStatusBuckets: FieldworkStatusBucket[];
  severityDistribution: FieldworkSeverityBucket[];
  reviewQueue: FieldworkProcedureRow[];
  assignedWork: FieldworkProcedureRow[];
  outstandingProcedures: FieldworkProcedureRow[];
  workingPapers: FieldworkWorkingPaperRow[];
  recentDocuments: FieldworkWorkingPaperRow[];
  evidence: FieldworkEvidenceRow[];
  openFindings: FieldworkFindingRow[];
  resolvedFindings: FieldworkFindingRow[];
  comments: FieldworkCommentRow[];
  reviewNotes: FieldworkCommentRow[];
  recentActivity: FieldworkActivityRow[];
  activityFeed: FieldworkActivityRow[];
  timeline: FieldworkTimelineRow[];
  reviewQueueCount: number;
  fieldworkHealth: string;
  fieldworkHealthVariant: "default" | "warning" | "success" | "destructive";
  completionPct: number;
  assignedAuditorCount: number;
  tickmarkCount: number;
  evidenceCount: number;
  openNotesCount: number;
  lastUpdated: string | null;
};
