import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const ENGAGEMENTS_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "engagements.explain",
    name: "Explain Engagement",
    moduleId: "engagements",
    description: "Explain engagement workspace purpose and current engagement context.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([ENGAGEMENT_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain engagement", "what is engagement", "engagement overview"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    relatedActionIds: ["platform.open_engagement"],
    buildContext: ({ knowledge, context }) => ({
      title: "Explain Engagement",
      description: knowledge?.purpose ?? "Engagement lifecycle and audit phases.",
      structuredContext: {
        focus: "engagement_explanation",
        engagementId: context.engagementId,
        engagementSlug: context.engagementSlug,
      },
    }),
  }),
  defineAiSkill({
    id: "engagements.current_progress",
    name: "Current Progress",
    moduleId: "engagements",
    description: "Structured current progress context for the active engagement.",
    category: "workflow",
    capabilities: ["status", "summarize"],
    permission: workspaceReadPermission([ENGAGEMENT_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["current progress", "engagement progress", "where are we"],
    plannerIntents: ["answer", "suggest"],
    priority: 75,
    buildContext: ({ context, knowledge }) => ({
      title: "Current Progress",
      description: "Progress envelope derived from workflow context — no status mutation.",
      structuredContext: {
        focus: "engagement_progress",
        engagementId: context.engagementId,
        workflowId: context.workflowId,
        workflowStatus: context.workflowStatus,
        phases: knowledge?.workflow ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "engagements.next_phase",
    name: "Next Phase",
    moduleId: "engagements",
    description: "Recommend next engagement phase metadata — does not advance workflow.",
    category: "recommendation",
    capabilities: ["recommend", "workflow"],
    permission: workspaceReadPermission([ENGAGEMENT_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["next phase", "continue workflow", "what next"],
    plannerIntents: ["suggest", "call_registered_action"],
    priority: 80,
    relatedActionIds: ["platform.continue_workflow"],
    buildContext: ({ knowledge, context }) => ({
      title: "Next Phase",
      description: "Next-phase recommendation metadata for host orchestration.",
      structuredContext: {
        focus: "next_phase",
        engagementId: context.engagementId,
        workflow: knowledge?.workflow ?? [],
        currentWorkflowId: context.workflowId,
      },
      recommendedActions: [
        {
          label: "Continue workflow",
          kind: "continue_workflow",
          actionId: "platform.continue_workflow",
          estimatedResult: "Would continue engagement workflow.",
        },
      ],
    }),
  }),
  defineAiSkill({
    id: "engagements.audit_timeline",
    name: "Audit Timeline",
    moduleId: "engagements",
    description: "Structured audit timeline context for the engagement.",
    category: "audit",
    capabilities: ["timeline", "list"],
    permission: workspaceReadPermission([ENGAGEMENT_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["audit timeline", "engagement timeline", "phase timeline"],
    plannerIntents: ["answer", "explain"],
    priority: 60,
    buildContext: ({ knowledge, context }) => ({
      title: "Audit Timeline",
      description: "Timeline envelope for engagement phases.",
      structuredContext: {
        focus: "audit_timeline",
        engagementId: context.engagementId,
        phases: knowledge?.workflow ?? [],
      },
    }),
  }),
];
