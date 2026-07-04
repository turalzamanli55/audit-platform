export type PlanningCommandKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type PlanningWorkflowStep = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
  description?: string;
};

export type PlanningChecklistRow = {
  id: string;
  label: string;
  completed: boolean;
  href: string;
};

export type PlanningDocumentRow = {
  id: string;
  name: string;
  documentType: string;
  status: string;
  time: string;
  href: string;
};

export type PlanningTimelineRow = {
  id: string;
  label: string;
  startDate: string | null;
  endDate: string | null;
  href: string;
};

export type PlanningActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type PlanningCommentRow = {
  id: string;
  body: string;
  type: string;
  time: string;
};

export type PlanningTeamRow = {
  id: string;
  displayName: string;
  role: string;
};

export type PlanningCommandCenterData = {
  executive: PlanningCommandKpi[];
  planningHealth: PlanningCommandKpi[];
  planningMetrics: PlanningCommandKpi[];
  workflowSteps: PlanningWorkflowStep[];
  currentWorkflowStep: string;
  openChecklistCount: number;
  checklistItems: PlanningChecklistRow[];
  documents: PlanningDocumentRow[];
  notesPreview: string | null;
  hasNotes: boolean;
  timeline: PlanningTimelineRow[];
  upcomingDeadline: string | null;
  deadlineLabel: string | null;
  isOverdue: boolean;
  reviewQueueCount: number;
  approvalStatus: string;
  approvalVariant: "default" | "warning" | "success" | "destructive";
  recentActivity: PlanningActivityRow[];
  activityFeed: PlanningActivityRow[];
  recentChanges: PlanningActivityRow[];
  comments: PlanningCommentRow[];
  team: PlanningTeamRow[];
  outstandingTasks: PlanningChecklistRow[];
  estimatedHours: number | null;
};
