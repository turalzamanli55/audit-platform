export type DashboardKpiCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
  variant?: "default" | "warning" | "success" | "destructive";
};

export type DashboardAttentionItem = {
  id: string;
  label: string;
  description?: string;
  href: string;
  module: string;
  priority: "high" | "medium" | "low";
};

export type DashboardModuleHealthItem = {
  id: "planning" | "materiality" | "risk" | "fieldwork";
  label: string;
  pendingReview: number;
  inProgress: number;
  approved: number;
  href: string;
};

export type DashboardEngagementRow = {
  id: string;
  slug: string;
  name: string;
  companyName: string;
  lifecycleStatus: string;
  periodEnd: string | null;
  href: string;
  isOverdue: boolean;
  daysOverdue?: number;
};

export type DashboardCommentRow = {
  id: string;
  module: string;
  body: string;
  createdAt: string;
  time: string;
  href: string;
};

export type DashboardApprovalRow = {
  id: string;
  module: string;
  label: string;
  status: string;
  href: string;
};

export type DashboardActivityRow = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "default" | "success" | "info";
  actor?: string | null;
  isToday: boolean;
};

export type DashboardCommandCenterData = {
  attention: DashboardAttentionItem[];
  executive: DashboardKpiCard[];
  review: DashboardKpiCard[];
  operational: DashboardKpiCard[];
  moduleHealth: DashboardModuleHealthItem[];
  overdueEngagements: DashboardEngagementRow[];
  activeEngagements: DashboardEngagementRow[];
  todayActivity: DashboardActivityRow[];
  auditTrail: DashboardActivityRow[];
  recentComments: DashboardCommentRow[];
  pendingApprovals: DashboardApprovalRow[];
  attentionCount: number;
  overdueCount: number;
};
