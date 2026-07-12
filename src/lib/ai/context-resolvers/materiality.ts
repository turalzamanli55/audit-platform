import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const materialityContextResolver = defineModuleResolver({
  moduleId: "materiality",
  displayName: "Materiality",
  summary: "Explain materiality calculations, thresholds, anomalies, and benchmarks.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_calculation",
      kind: "explain",
      labelId: "explainCalculation",
      label: "Explain calculation",
      utteranceTemplate: "Explain the materiality calculation for {{object}}.",
    },
    {
      id: "suggest_thresholds",
      kind: "suggest",
      labelId: "suggestThresholds",
      label: "Suggest thresholds",
      utteranceTemplate: "Suggest materiality thresholds for {{object}} and explain rationale.",
    },
    {
      id: "find_anomalies",
      kind: "analyze",
      labelId: "findAnomalies",
      label: "Find anomalies",
      utteranceTemplate: "Find anomalies in materiality for {{object}}.",
    },
    {
      id: "compare_years",
      kind: "compare",
      labelId: "compareYears",
      label: "Compare years",
      utteranceTemplate: "Compare materiality across years for {{object}}.",
    },
    {
      id: "explain_benchmark",
      kind: "explain",
      labelId: "explainBenchmark",
      label: "Explain benchmark",
      utteranceTemplate: "Explain the materiality benchmark used for {{object}}.",
    },
  ],
  suggestions: [
    "Explain this materiality calculation.",
    "Suggest thresholds and justify them.",
    "Compare materiality with the prior year.",
  ],
  relatedObjectTypes: ["materiality_package", "benchmark", "threshold"],
  knowledgeHints: ["performance materiality", "benchmark selection"],
});
