/**
 * Enterprise AI Skills Engine
 *
 * Planner → Skill Resolver → Skill Registry → Selected Skill →
 * structured context for Prompt Builder / LLM Platform
 *
 * Never calls LLMs. Never executes actions. Never mutates data. Never returns UI.
 */

export * from "@/lib/ai/skills/contracts";
export * from "@/lib/ai/skills/shared";
export * from "@/lib/ai/skills/registry";
export * from "@/lib/ai/skills/resolver";
export * from "@/lib/ai/skills/executor";
export {
  AI_SKILL_CATALOG,
  createPopulatedAiSkillRegistry,
} from "@/lib/ai/skills/catalog";

export { DASHBOARD_AI_SKILLS } from "@/lib/ai/skills/dashboard/skills";
export { COMPANIES_AI_SKILLS } from "@/lib/ai/skills/companies/skills";
export { ENGAGEMENTS_AI_SKILLS } from "@/lib/ai/skills/engagements/skills";
export { PLANNING_AI_SKILLS } from "@/lib/ai/skills/planning/skills";
export { MATERIALITY_AI_SKILLS } from "@/lib/ai/skills/materiality/skills";
export { RISK_ASSESSMENT_AI_SKILLS } from "@/lib/ai/skills/risk-assessment/skills";
export { FIELDWORK_AI_SKILLS } from "@/lib/ai/skills/fieldwork/skills";
export { REVIEW_AI_SKILLS } from "@/lib/ai/skills/review/skills";
export { COMPLETION_AI_SKILLS } from "@/lib/ai/skills/completion/skills";
export { REPORTING_AI_SKILLS } from "@/lib/ai/skills/reporting/skills";
export { OPINION_AI_SKILLS } from "@/lib/ai/skills/opinion/skills";
export { FINANCIAL_STATEMENTS_AI_SKILLS } from "@/lib/ai/skills/financial-statements/skills";
export { TRIAL_BALANCE_AI_SKILLS } from "@/lib/ai/skills/trial-balance/skills";
export { UAIE_AI_SKILLS } from "@/lib/ai/skills/uaie/skills";
export { IMPORT_INTELLIGENCE_AI_SKILLS } from "@/lib/ai/skills/import-intelligence/skills";
export { SETTINGS_AI_SKILLS } from "@/lib/ai/skills/settings/skills";
