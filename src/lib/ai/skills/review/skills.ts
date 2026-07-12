import { REVIEW_PERMISSIONS } from "@/constants/review";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const REVIEW_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "review.queue",
    name: "Review Queue",
    moduleId: "review",
    description: "Structured review queue context.",
    category: "workflow",
    capabilities: ["list", "status"],
    permission: workspaceReadPermission([REVIEW_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["review queue", "my reviews", "review list"],
    plannerIntents: ["search", "answer"],
    priority: 80,
    buildContext: ({ context }) => ({
      title: "Review Queue",
      description: "Queue envelope for pending review items.",
      structuredContext: {
        focus: "review_queue",
        engagementId: context.engagementId,
        queueScopes: ["assigned", "team", "engagement"],
      },
    }),
  }),
  defineAiSkill({
    id: "review.pending",
    name: "Pending Reviews",
    moduleId: "review",
    description: "Structured pending reviews context.",
    category: "audit",
    capabilities: ["list", "status"],
    permission: workspaceReadPermission([REVIEW_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["pending reviews", "show pending reviews", "reviews pending"],
    plannerIntents: ["search", "suggest"],
    priority: 78,
    buildContext: ({ context }) => ({
      title: "Pending Reviews",
      severity: "warning",
      description: "Pending review filter envelope.",
      structuredContext: {
        focus: "pending_reviews",
        engagementId: context.engagementId,
        statuses: ["pending", "in_review"],
      },
    }),
  }),
  defineAiSkill({
    id: "review.reviewer_notes",
    name: "Reviewer Notes",
    moduleId: "review",
    description: "Structured reviewer notes context.",
    category: "context",
    capabilities: ["list", "summarize"],
    permission: workspaceReadPermission([REVIEW_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["reviewer notes", "review notes", "notes from reviewer"],
    plannerIntents: ["answer", "explain"],
    priority: 60,
    buildContext: () => ({
      title: "Reviewer Notes",
      description: "Notes envelope — no comment mutation.",
      structuredContext: {
        focus: "reviewer_notes",
        noteKinds: ["query", "coaching", "sign_off"],
      },
    }),
  }),
  defineAiSkill({
    id: "review.open_findings",
    name: "Open Findings",
    moduleId: "review",
    description: "Structured open findings context from review.",
    category: "audit",
    capabilities: ["list"],
    permission: workspaceReadPermission([REVIEW_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["open findings", "review findings", "unresolved findings"],
    plannerIntents: ["search", "answer"],
    priority: 75,
    buildContext: ({ context }) => ({
      title: "Open Findings",
      severity: "warning",
      description: "Open findings filter envelope.",
      structuredContext: {
        focus: "open_findings",
        engagementId: context.engagementId,
        status: "open",
      },
    }),
  }),
];
