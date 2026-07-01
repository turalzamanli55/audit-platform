export type DashboardWorkspaceActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "default" | "success" | "info";
};

export type DashboardWorkspaceTaskItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due: string;
  statusVariant: "default" | "warning" | "success";
  priorityVariant: "default" | "warning" | "destructive";
};

export type DashboardWorkspaceLabels = {
  meta: {
    title: string;
    description: string;
  };
  context: {
    organization: string;
    workspace: string;
    company: string;
    none: string;
  };
  welcome: {
    greeting: string;
    timeMorning: string;
    timeAfternoon: string;
    timeEvening: string;
    summary: string;
    motivation: string;
  };
  kpi: {
    companies: string;
    engagements: string;
    openTasks: string;
    reports: string;
    aiSuggestions: string;
    placeholder: string;
  };
  quickActions: {
    title: string;
    description: string;
    createCompany: string;
    createEngagement: string;
    importTrialBalance: string;
    continueLastWork: string;
    inviteUser: string;
    comingSoon: string;
  };
  activity: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    items: DashboardWorkspaceActivityItem[];
  };
  tasks: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    statusOpen: string;
    statusInProgress: string;
    statusDone: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    items: DashboardWorkspaceTaskItem[];
  };
  ai: {
    title: string;
    description: string;
    placeholder: string;
    recentTitle: string;
    suggestionsTitle: string;
    askButton: string;
    conversations: string[];
    suggestions: string[];
  };
  calendar: {
    title: string;
    description: string;
    emptyTitle: string;
    upcoming: string;
    items: Array<{ id: string; title: string; date: string; tone: "default" | "warning" }>;
  };
  notifications: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    viewAll: string;
  };
  insights: {
    title: string;
    description: string;
    chartPlaceholder: string;
    metrics: Array<{ id: string; label: string; value: string; trend: string }>;
  };
  pinned: {
    title: string;
    recentCompanies: string;
    favoriteCompanies: string;
    recentEngagements: string;
    emptyRecent: string;
    emptyFavorites: string;
    emptyEngagements: string;
    engagements: string[];
  };
  continueWorking: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  shortcuts: {
    title: string;
    description: string;
    items: Array<{ id: string; label: string; hint: string }>;
  };
  tips: {
    title: string;
    items: string[];
  };
  error: {
    title: string;
    description: string;
  };
  loading: string;
};
