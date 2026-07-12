import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const COMPLETION_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "completion.readiness",
    name: "Completion Readiness",
    moduleId: "completion",
    description: "Structured completion readiness context.",
    category: "validation",
    capabilities: ["status", "validate"],
    permission: workspaceReadPermission([COMPLETION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["completion readiness", "ready to complete", "completion checklist"],
    plannerIntents: ["answer", "suggest"],
    priority: 80,
    buildContext: ({ knowledge, context }) => ({
      title: "Completion Readiness",
      description: "Readiness envelope for engagement completion.",
      structuredContext: {
        focus: "completion_readiness",
        engagementId: context.engagementId,
        exitCriteria: knowledge?.outputs ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "completion.outstanding_items",
    name: "Outstanding Items",
    moduleId: "completion",
    description: "Structured outstanding completion items context.",
    category: "workflow",
    capabilities: ["list", "status"],
    permission: workspaceReadPermission([COMPLETION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["outstanding items", "completion outstanding", "open completion"],
    plannerIntents: ["search", "suggest"],
    priority: 75,
    buildContext: ({ context }) => ({
      title: "Outstanding Items",
      severity: "warning",
      description: "Outstanding completion items envelope.",
      structuredContext: {
        focus: "completion_outstanding",
        engagementId: context.engagementId,
      },
    }),
  }),
  defineAiSkill({
    id: "completion.representation_letter",
    name: "Representation Letter",
    moduleId: "completion",
    description: "Structured representation letter context.",
    category: "audit",
    capabilities: ["status", "explain"],
    permission: workspaceReadPermission([COMPLETION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["representation letter", "management representation"],
    plannerIntents: ["answer", "explain"],
    priority: 65,
    buildContext: () => ({
      title: "Representation Letter",
      description: "Representation letter artifact envelope.",
      structuredContext: {
        focus: "representation_letter",
        artifactStates: ["draft", "issued", "received", "filed"],
      },
    }),
  }),
  defineAiSkill({
    id: "completion.management_letter",
    name: "Management Letter",
    moduleId: "completion",
    description: "Structured management letter context.",
    category: "audit",
    capabilities: ["status", "explain"],
    permission: workspaceReadPermission([COMPLETION_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["management letter", "letter to management"],
    plannerIntents: ["answer", "explain"],
    priority: 65,
    buildContext: () => ({
      title: "Management Letter",
      description: "Management letter artifact envelope.",
      structuredContext: {
        focus: "management_letter",
        artifactStates: ["draft", "review", "issued"],
      },
    }),
  }),
];
