export type CompanyWorkspaceKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type CompanyModuleProgress = {
  id: "planning" | "materiality" | "risk" | "fieldwork";
  label: string;
  progressPct: number;
  statusLabel: string;
  statusVariant: "default" | "warning" | "success" | "destructive";
  pendingReview: number;
  inProgress: number;
  approved: number;
  href?: string;
};

export type CompanyEngagementRow = {
  id: string;
  slug: string;
  name: string;
  lifecycleStatus: string;
  periodEnd: string | null;
  href: string;
  isOverdue: boolean;
  daysOverdue?: number;
};

export type CompanyActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type CompanyDocumentRow = {
  id: string;
  name: string;
  engagementName: string;
  documentType: string;
  createdAt: string;
  time: string;
  href: string;
};

export type CompanyCommentRow = {
  id: string;
  module: string;
  body: string;
  engagementName: string;
  time: string;
  href: string;
};

export type CompanyTeamMemberRow = {
  id: string;
  displayName: string;
  role: string;
  engagementCount: number;
};

export type CompanyComplianceSnapshot = {
  statusLabel: string;
  statusVariant: "default" | "warning" | "success" | "destructive";
  framework: string;
  jurisdiction: string;
  validatedAt: string | null;
  activeEngagements: number;
};

export type CompanyFinancialSnapshot = {
  framework: string;
  functionalCurrency: string;
  presentationCurrency: string | null;
  fiscalYearEnd: string;
  entityType: string;
  industry: string;
};

export type CompanyWorkspaceCommandCenterData = {
  health: CompanyWorkspaceKpi[];
  executive: CompanyWorkspaceKpi[];
  moduleProgress: CompanyModuleProgress[];
  activeEngagements: CompanyEngagementRow[];
  pendingReviews: number;
  openFindings: number;
  recentActivity: CompanyActivityRow[];
  recentDocuments: CompanyDocumentRow[];
  recentComments: CompanyCommentRow[];
  teamMembers: CompanyTeamMemberRow[];
  upcomingDeadlines: CompanyEngagementRow[];
  compliance: CompanyComplianceSnapshot;
  financial: CompanyFinancialSnapshot;
  attentionCount: number;
  primaryEngagementSlug: string | null;
};
