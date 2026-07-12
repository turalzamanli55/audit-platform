import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";
import { AiSkillRegistry } from "@/lib/ai/skills/registry/ai-skill-registry";
import { DASHBOARD_AI_SKILLS } from "@/lib/ai/skills/dashboard/skills";
import { COMPANIES_AI_SKILLS } from "@/lib/ai/skills/companies/skills";
import { ENGAGEMENTS_AI_SKILLS } from "@/lib/ai/skills/engagements/skills";
import { PLANNING_AI_SKILLS } from "@/lib/ai/skills/planning/skills";
import { MATERIALITY_AI_SKILLS } from "@/lib/ai/skills/materiality/skills";
import { RISK_ASSESSMENT_AI_SKILLS } from "@/lib/ai/skills/risk-assessment/skills";
import { FIELDWORK_AI_SKILLS } from "@/lib/ai/skills/fieldwork/skills";
import { REVIEW_AI_SKILLS } from "@/lib/ai/skills/review/skills";
import { COMPLETION_AI_SKILLS } from "@/lib/ai/skills/completion/skills";
import { REPORTING_AI_SKILLS } from "@/lib/ai/skills/reporting/skills";
import { OPINION_AI_SKILLS } from "@/lib/ai/skills/opinion/skills";
import { FINANCIAL_STATEMENTS_AI_SKILLS } from "@/lib/ai/skills/financial-statements/skills";
import { TRIAL_BALANCE_AI_SKILLS } from "@/lib/ai/skills/trial-balance/skills";
import { UAIE_AI_SKILLS } from "@/lib/ai/skills/uaie/skills";
import { IMPORT_INTELLIGENCE_AI_SKILLS } from "@/lib/ai/skills/import-intelligence/skills";
import { SETTINGS_AI_SKILLS } from "@/lib/ai/skills/settings/skills";

/** Canonical platform skill catalog — single registration source. */
export const AI_SKILL_CATALOG: readonly AiSkillRegistration[] = [
  ...DASHBOARD_AI_SKILLS,
  ...COMPANIES_AI_SKILLS,
  ...ENGAGEMENTS_AI_SKILLS,
  ...PLANNING_AI_SKILLS,
  ...MATERIALITY_AI_SKILLS,
  ...RISK_ASSESSMENT_AI_SKILLS,
  ...FIELDWORK_AI_SKILLS,
  ...REVIEW_AI_SKILLS,
  ...COMPLETION_AI_SKILLS,
  ...REPORTING_AI_SKILLS,
  ...OPINION_AI_SKILLS,
  ...FINANCIAL_STATEMENTS_AI_SKILLS,
  ...TRIAL_BALANCE_AI_SKILLS,
  ...UAIE_AI_SKILLS,
  ...IMPORT_INTELLIGENCE_AI_SKILLS,
  ...SETTINGS_AI_SKILLS,
];

export function createPopulatedAiSkillRegistry(
  registrations: readonly AiSkillRegistration[] = AI_SKILL_CATALOG,
): AiSkillRegistry {
  const registry = new AiSkillRegistry();
  registry.registerAll(registrations);
  return registry;
}
