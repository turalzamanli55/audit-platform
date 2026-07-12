import { COMPANY_PERMISSIONS } from "@/constants/company";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const COMPANIES_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "companies.explain",
    name: "Explain Company",
    moduleId: "companies",
    description: "Explain the company module and current company context.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([COMPANY_PERMISSIONS.READ], { requireCompany: false }),
    intentHints: ["explain company", "what is company", "company overview"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    relatedActionIds: ["platform.open_company"],
    buildContext: ({ knowledge, context }) => ({
      title: "Explain Company",
      description: knowledge?.purpose ?? "Company workspace and entity profile.",
      structuredContext: {
        focus: "company_explanation",
        companyId: context.companyId,
        companySlug: context.companySlug,
      },
    }),
  }),
  defineAiSkill({
    id: "companies.analyze",
    name: "Analyze Company",
    moduleId: "companies",
    description: "Structured analysis context for the active company.",
    category: "analysis",
    capabilities: ["analyze", "summarize"],
    permission: workspaceReadPermission([COMPANY_PERMISSIONS.READ], { requireCompany: false }),
    intentHints: ["analyze company", "company analysis", "company health"],
    plannerIntents: ["suggest", "answer"],
    priority: 65,
    buildContext: ({ context, knowledge }) => ({
      title: "Analyze Company",
      description: "Structured company analysis envelope — no scoring mutations.",
      structuredContext: {
        focus: "company_analysis",
        companyId: context.companyId,
        analysisAxes: ["identity", "reporting_profile", "engagements", "compliance"],
        inputs: knowledge?.inputs ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "companies.open",
    name: "Open Company",
    moduleId: "companies",
    description: "Resolve open-company recommendation metadata — does not navigate.",
    category: "navigation",
    capabilities: ["navigate"],
    permission: workspaceReadPermission([COMPANY_PERMISSIONS.READ]),
    intentHints: ["open company", "go to company", "show company"],
    plannerIntents: ["call_registered_action", "navigate", "open_module"],
    priority: 80,
    relatedActionIds: ["platform.open_company"],
    buildContext: ({ context, payload }) => ({
      title: "Open Company",
      description: "Company open instruction metadata for Action Registry — not executed.",
      structuredContext: {
        focus: "open_company",
        companyId: context.companyId ?? payload?.companyId ?? null,
        slug: context.companySlug ?? payload?.slug ?? null,
      },
      recommendedActions: [
        {
          label: "Open company",
          kind: "open_company",
          actionId: "platform.open_company",
          estimatedResult: "Would open company workspace.",
        },
      ],
    }),
  }),
  defineAiSkill({
    id: "companies.timeline",
    name: "Company Timeline",
    moduleId: "companies",
    description: "Structured company timeline context.",
    category: "context",
    capabilities: ["timeline", "list"],
    permission: workspaceReadPermission([COMPANY_PERMISSIONS.READ], { requireCompany: false }),
    intentHints: ["company timeline", "company history", "company activity"],
    plannerIntents: ["answer", "explain"],
    priority: 55,
    buildContext: ({ context }) => ({
      title: "Company Timeline",
      description: "Timeline envelope for company events — no data fetch here.",
      structuredContext: {
        focus: "company_timeline",
        companyId: context.companyId,
        lanes: ["profile_changes", "engagements", "imports", "reviews"],
      },
    }),
  }),
];
