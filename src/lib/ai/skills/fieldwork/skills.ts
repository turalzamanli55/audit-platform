import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const FIELDWORK_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "fieldwork.explain_procedures",
    name: "Explain Procedures",
    moduleId: "fieldwork",
    description: "Explain fieldwork procedures and module purpose.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([FIELDWORK_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain procedures", "explain fieldwork", "audit procedures"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: ({ knowledge }) => ({
      title: "Explain Procedures",
      description: knowledge?.purpose ?? "Fieldwork procedures workspace.",
      structuredContext: { focus: "fieldwork_procedures", workflow: knowledge?.workflow ?? [] },
    }),
  }),
  defineAiSkill({
    id: "fieldwork.review_findings",
    name: "Review Findings",
    moduleId: "fieldwork",
    description: "Structured findings review context from fieldwork.",
    category: "audit",
    capabilities: ["list", "analyze"],
    permission: workspaceReadPermission([FIELDWORK_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["review findings", "fieldwork findings", "findings"],
    plannerIntents: ["search", "answer"],
    priority: 75,
    buildContext: ({ context }) => ({
      title: "Review Findings",
      severity: "warning",
      description: "Findings envelope — no finding store mutation.",
      structuredContext: {
        focus: "fieldwork_findings",
        engagementId: context.engagementId,
        findingStates: ["open", "cleared", "carried_forward"],
      },
    }),
  }),
  defineAiSkill({
    id: "fieldwork.evidence_summary",
    name: "Evidence Summary",
    moduleId: "fieldwork",
    description: "Structured evidence summary context.",
    category: "analysis",
    capabilities: ["summarize"],
    permission: workspaceReadPermission([FIELDWORK_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["evidence summary", "summarize evidence", "working papers"],
    plannerIntents: ["answer"],
    priority: 65,
    buildContext: ({ knowledge }) => ({
      title: "Evidence Summary",
      description: "Evidence coverage envelope for fieldwork.",
      structuredContext: {
        focus: "evidence_summary",
        evidenceKinds: knowledge?.inputs ?? ["working_papers", "samples", "confirmations"],
      },
    }),
  }),
  defineAiSkill({
    id: "fieldwork.outstanding_work",
    name: "Outstanding Work",
    moduleId: "fieldwork",
    description: "Structured outstanding fieldwork items context.",
    category: "workflow",
    capabilities: ["list", "status"],
    permission: workspaceReadPermission([FIELDWORK_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["outstanding work", "incomplete procedures", "pending fieldwork"],
    plannerIntents: ["suggest", "search"],
    priority: 80,
    buildContext: ({ context }) => ({
      title: "Outstanding Work",
      severity: "warning",
      description: "Outstanding work filter envelope.",
      structuredContext: {
        focus: "outstanding_fieldwork",
        engagementId: context.engagementId,
        filters: { status: ["not_started", "in_progress"] },
      },
    }),
  }),
];
