import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const MATERIALITY_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "materiality.explain",
    name: "Explain Materiality",
    moduleId: "materiality",
    description: "Explain materiality concepts and module purpose.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([MATERIALITY_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["explain materiality", "what is materiality"],
    plannerIntents: ["explain", "answer"],
    priority: 70,
    buildContext: ({ knowledge }) => ({
      title: "Explain Materiality",
      description: knowledge?.purpose ?? "Materiality determination workspace.",
      structuredContext: { focus: "materiality_explanation" },
    }),
  }),
  defineAiSkill({
    id: "materiality.summary",
    name: "Materiality Summary",
    moduleId: "materiality",
    description: "Structured materiality summary context.",
    category: "analysis",
    capabilities: ["summarize", "status"],
    permission: workspaceReadPermission([MATERIALITY_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["materiality summary", "summarize materiality"],
    plannerIntents: ["answer"],
    priority: 65,
    buildContext: ({ context, knowledge }) => ({
      title: "Materiality Summary",
      description: "Summary envelope for materiality determination.",
      structuredContext: {
        focus: "materiality_summary",
        engagementId: context.engagementId,
        outputs: knowledge?.outputs ?? [],
      },
    }),
  }),
  defineAiSkill({
    id: "materiality.benchmark_analysis",
    name: "Benchmark Analysis",
    moduleId: "materiality",
    description: "Structured benchmark analysis context for materiality.",
    category: "analysis",
    capabilities: ["analyze"],
    permission: workspaceReadPermission([MATERIALITY_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["benchmark analysis", "materiality benchmark", "benchmark"],
    plannerIntents: ["answer", "suggest"],
    priority: 75,
    buildContext: () => ({
      title: "Benchmark Analysis",
      description: "Benchmark axes envelope — no calculation execution.",
      structuredContext: {
        focus: "materiality_benchmarks",
        benchmarkAxes: ["revenue", "total_assets", "profit_before_tax", "equity"],
      },
    }),
  }),
  defineAiSkill({
    id: "materiality.threshold_explanation",
    name: "Threshold Explanation",
    moduleId: "materiality",
    description: "Explain materiality threshold structure.",
    category: "explanation",
    capabilities: ["explain"],
    permission: workspaceReadPermission([MATERIALITY_PERMISSIONS.READ], { requireEngagement: false }),
    intentHints: ["threshold explanation", "materiality threshold", "performance materiality"],
    plannerIntents: ["explain", "answer"],
    priority: 72,
    buildContext: () => ({
      title: "Threshold Explanation",
      description: "Threshold taxonomy for overall, performance, and clearly trivial amounts.",
      structuredContext: {
        focus: "materiality_thresholds",
        thresholdKinds: ["overall", "performance", "clearly_trivial"],
      },
    }),
  }),
];
