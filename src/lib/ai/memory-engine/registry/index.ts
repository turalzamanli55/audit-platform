import type { EmeMemoryLevel } from "@/lib/ai/memory-engine/types";

export type EmeMemoryCategoryDefinition = {
  level: EmeMemoryLevel;
  category: string;
  label: string;
  description: string;
  defaultImportance: number;
};

const USER_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "user", category: "language", label: "Language", description: "Preferred UI and response language.", defaultImportance: 0.9 },
  { level: "user", category: "writing_style", label: "Writing Style", description: "Preferred tone and phrasing.", defaultImportance: 0.6 },
  { level: "user", category: "favorite_workflows", label: "Favorite Workflows", description: "Frequently used audit workflows.", defaultImportance: 0.7 },
  { level: "user", category: "preferred_reports", label: "Preferred Reports", description: "Report formats the user prefers.", defaultImportance: 0.65 },
  { level: "user", category: "audit_style", label: "Audit Style", description: "Preferred audit approach.", defaultImportance: 0.7 },
  { level: "user", category: "standards", label: "Preferred Standards", description: "IFRS, ISA, or local standards preference.", defaultImportance: 0.75 },
  { level: "user", category: "ai_verbosity", label: "AI Verbosity", description: "Preferred AI response length.", defaultImportance: 0.8 },
  { level: "user", category: "explanations", label: "Explanation Style", description: "Brief, guided, or technical explanations.", defaultImportance: 0.75 },
];

const WORKSPACE_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "workspace", category: "selected_company", label: "Selected Company", description: "Last active company in workspace.", defaultImportance: 0.85 },
  { level: "workspace", category: "selected_engagement", label: "Selected Engagement", description: "Last active engagement.", defaultImportance: 0.85 },
  { level: "workspace", category: "selected_module", label: "Selected Module", description: "Last active module.", defaultImportance: 0.7 },
  { level: "workspace", category: "current_workflow", label: "Current Workflow", description: "Active workflow context.", defaultImportance: 0.8 },
  { level: "workspace", category: "active_filters", label: "Active Filters", description: "Recent table and list filters.", defaultImportance: 0.6 },
  { level: "workspace", category: "recent_searches", label: "Recent Searches", description: "Recent workspace searches.", defaultImportance: 0.55 },
  { level: "workspace", category: "favorite_dashboards", label: "Favorite Dashboards", description: "Pinned dashboards.", defaultImportance: 0.65 },
];

const COMPANY_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "company", category: "industry", label: "Industry", description: "Company industry classification.", defaultImportance: 0.8 },
  { level: "company", category: "erp", label: "ERP", description: "Enterprise resource planning system.", defaultImportance: 0.75 },
  { level: "company", category: "currency", label: "Currency", description: "Functional and presentation currency.", defaultImportance: 0.85 },
  { level: "company", category: "accounting_style", label: "Accounting Style", description: "Accounting conventions used.", defaultImportance: 0.7 },
  { level: "company", category: "chart_of_accounts", label: "Chart of Accounts", description: "COA structure preferences.", defaultImportance: 0.75 },
  { level: "company", category: "common_imports", label: "Common Imports", description: "Frequent import sources.", defaultImportance: 0.65 },
  { level: "company", category: "preferred_mappings", label: "Preferred Mappings", description: "Approved mapping patterns.", defaultImportance: 0.8 },
  { level: "company", category: "known_synonyms", label: "Known Synonyms", description: "Account and entity synonyms.", defaultImportance: 0.7 },
  { level: "company", category: "uaie_corrections", label: "UAIE Corrections", description: "Approved UAIE correction patterns.", defaultImportance: 0.85 },
];

const ENGAGEMENT_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "engagement", category: "materiality", label: "Materiality Choices", description: "Materiality thresholds and rationale.", defaultImportance: 0.9 },
  { level: "engagement", category: "risk_appetite", label: "Risk Appetite", description: "Engagement risk posture.", defaultImportance: 0.85 },
  { level: "engagement", category: "review_decisions", label: "Review Decisions", description: "Review preferences and decisions.", defaultImportance: 0.8 },
  { level: "engagement", category: "completion_preferences", label: "Completion Preferences", description: "Completion workflow preferences.", defaultImportance: 0.75 },
  { level: "engagement", category: "reporting_style", label: "Reporting Style", description: "Reporting presentation preferences.", defaultImportance: 0.7 },
  { level: "engagement", category: "opinion_history", label: "Opinion History", description: "Prior opinion patterns (non-binding).", defaultImportance: 0.65 },
];

const ORGANIZATION_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "organization", category: "methodology", label: "Methodology", description: "Firm audit methodology.", defaultImportance: 0.9 },
  { level: "organization", category: "templates", label: "Templates", description: "Standard templates.", defaultImportance: 0.8 },
  { level: "organization", category: "approval_flow", label: "Approval Flow", description: "Approval hierarchy.", defaultImportance: 0.85 },
  { level: "organization", category: "review_hierarchy", label: "Review Hierarchy", description: "Review chain structure.", defaultImportance: 0.8 },
  { level: "organization", category: "firm_policies", label: "Firm Policies", description: "Quality and firm policies.", defaultImportance: 0.9 },
  { level: "organization", category: "quality_rules", label: "Quality Rules", description: "Quality control rules.", defaultImportance: 0.85 },
];

const LEARNING_CATEGORIES: EmeMemoryCategoryDefinition[] = [
  { level: "learning", category: "approved_mapping", label: "Approved Mapping", description: "User-approved mapping.", defaultImportance: 0.85 },
  { level: "learning", category: "approved_suggestion", label: "Approved Suggestion", description: "Accepted AI suggestion.", defaultImportance: 0.75 },
  { level: "learning", category: "rejected_suggestion", label: "Rejected Suggestion", description: "Rejected AI suggestion.", defaultImportance: 0.7 },
  { level: "learning", category: "tool_usage", label: "Tool Usage", description: "Tool usage pattern.", defaultImportance: 0.6 },
  { level: "learning", category: "workflow_order", label: "Workflow Order", description: "Preferred workflow sequence.", defaultImportance: 0.65 },
  { level: "learning", category: "navigation_habit", label: "Navigation Habit", description: "Navigation pattern.", defaultImportance: 0.55 },
  { level: "learning", category: "repeated_prompt", label: "Repeated Prompt", description: "Frequently repeated prompt.", defaultImportance: 0.5 },
  { level: "learning", category: "frequent_action", label: "Frequent Action", description: "Frequently performed action.", defaultImportance: 0.6 },
];

export const EME_MEMORY_REGISTRY: readonly EmeMemoryCategoryDefinition[] = [
  ...USER_CATEGORIES,
  ...WORKSPACE_CATEGORIES,
  ...COMPANY_CATEGORIES,
  ...ENGAGEMENT_CATEGORIES,
  ...ORGANIZATION_CATEGORIES,
  ...LEARNING_CATEGORIES,
];

export class EmeMemoryRegistry {
  list(level?: EmeMemoryLevel): EmeMemoryCategoryDefinition[] {
    return level ? EME_MEMORY_REGISTRY.filter((entry) => entry.level === level) : [...EME_MEMORY_REGISTRY];
  }

  get(level: EmeMemoryLevel, category: string): EmeMemoryCategoryDefinition | undefined {
    return EME_MEMORY_REGISTRY.find((entry) => entry.level === level && entry.category === category);
  }
}
